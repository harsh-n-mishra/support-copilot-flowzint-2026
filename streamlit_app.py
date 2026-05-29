import requests
import streamlit as st

API_URL = st.sidebar.text_input("API base URL", value="http://127.0.0.1:8000")
SESSION_ID = st.sidebar.text_input("Session ID", value="demo-user")

st.title("AI Support Chatbot")
st.caption("RAG + citations + memory + support handoff")

if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

prompt = st.chat_input("Ask a support question")
if prompt:
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    try:
        response = requests.post(
            f"{API_URL}/chat",
            json={"question": prompt, "session_id": SESSION_ID},
            timeout=60,
        )
        response.raise_for_status()
        data = response.json()

        answer = data["answer"]
        if data.get("sources"):
            answer += "\n\n**Sources**\n"
            for source in data["sources"]:
                answer += (
                    f"- [{source['id']}] `{source['source']}` "
                    f"(score: {source['score']})\n"
                )
        if data.get("handoff"):
            handoff = data["handoff"]
            answer += (
                "\n\n**Human handoff created**\n"
                f"- Ticket: `{handoff['ticket_id']}`\n"
                f"- Reason: {handoff['reason']}\n"
                f"- Contact: {handoff['contact']}"
            )

    except requests.RequestException as exc:
        answer = f"API error: {exc}"

    st.session_state.messages.append({"role": "assistant", "content": answer})
    with st.chat_message("assistant"):
        st.markdown(answer)

if st.sidebar.button("Clear backend memory"):
    requests.delete(f"{API_URL}/memory/{SESSION_ID}", timeout=10)
    st.sidebar.success("Backend memory cleared")