import { Search, Send } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { useState } from "react";

const contacts = [
  {
    name: "Maya Wilson",
    username: "maya_wilson",
    image: "https://i.pravatar.cc/150?img=5",
    message: "Hey! How are you?",
  },
  {
    name: "Alex Johnson",
    username: "alex_johnson",
    image: "https://i.pravatar.cc/150?img=12",
    message: "That looks amazing!",
  },
  {
    name: "Sarah Smith",
    username: "sarah_smith",
    image: "https://i.pravatar.cc/150?img=32",
    message: "See you tomorrow 😊",
  },
];

function Messages() {
  const [selected, setSelected] = useState(contacts[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hey! How are you?",
      mine: false,
    },
    {
      text: "I'm doing great! What about you?",
      mine: true,
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((previous) => [
      ...previous,
      {
        text: message,
        mine: true,
      },
    ]);

    setMessage("");
  };

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1100px]">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Messages
        </h1>

        <div className="mt-6 grid min-h-[650px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[300px_1fr]">
          {/* Contacts */}
          <div className="border-r border-slate-200">
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5">
                <Search
                  size={17}
                  className="text-slate-400"
                />

                <input
                  placeholder="Search messages"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="p-2">
              {contacts.map((contact) => (
                <button
                  key={contact.username}
                  type="button"
                  onClick={() => setSelected(contact)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${
                    selected.username === contact.username
                      ? "bg-slate-100"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <img
                    src={contact.image}
                    alt={contact.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {contact.name}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {contact.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
              <img
                src={selected.image}
                alt={selected.name}
                className="h-11 w-11 rounded-full object-cover"
              />

              <div>
                <p className="font-bold text-slate-900">
                  {selected.name}
                </p>

                <p className="text-xs text-green-500">
                  Active now
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.mine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      item.mine
                        ? "rounded-br-md bg-slate-900 text-white"
                        : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Messages;