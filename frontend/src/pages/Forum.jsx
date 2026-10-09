import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Forum.css";

const INITIAL_THREADS = [
  {
    id: 1,
    author: "Budi Santoso",
    avatar: "BS",
    title: "Tips mengatasi wereng pada padi usia 30 HST",
    content: "Sawah saya terserang wereng coklat cukup parah. Sudah coba berbagai insektisida tapi hasilnya kurang memuaskan. Ada yang pernah mengalami hal serupa? Bagaimana cara mengatasinya?",
    tags: ["padi", "hama", "wereng"],
    likes: 14,
    replies: [
      { id: 1, author: "Pak Joko", avatar: "PJ", content: "Saya biasa pakai varietas tahan wereng sejak awal. Sekarang pakai Inpari 13, jarang kena wereng parah.", time: "2 jam lalu" },
      { id: 2, author: "Ibu Sari", avatar: "IS", content: "Coba semprot Confidor atau Cruiser dosis anjuran, jangan berlebihan. Pastikan semprot ke pangkal batang.", time: "1 jam lalu" },
    ],
    time: "5 jam lalu",
    pinned: true,
  },
  {
    id: 2,
    author: "Ravi Sharma",
    avatar: "RS",
    title: "Rekomendasi pupuk organik untuk jagung musim hujan",
    content: "Mau tanya ke sesama petani, pupuk organik apa yang paling efektif untuk jagung di musim hujan? Saya lahan 2 hektar, mau beralih ke organik tahun ini.",
    tags: ["jagung", "pupuk", "organik"],
    likes: 9,
    replies: [
      { id: 1, author: "Mas Agus", avatar: "MA", content: "Saya pakai kompos kotoran sapi + EM4. Dicampur dan difermentasi 2 minggu sebelum tanam. Hasilnya bagus!", time: "3 jam lalu" },
    ],
    time: "8 jam lalu",
    pinned: false,
  },
  {
    id: 3,
    author: "Ani Rahayu",
    avatar: "AR",
    title: "Pengalaman pakai drip irrigation untuk cabai",
    content: "Sudah 2 musim pakai irigasi tetes untuk lahan cabai 0.5 ha. Hemat air 40%, hasil panen meningkat 30%. Ada yang mau tanya-tanya seputar instalasi dan biayanya?",
    tags: ["cabai", "irigasi", "efisiensi"],
    likes: 22,
    replies: [],
    time: "1 hari lalu",
    pinned: false,
  },
  {
    id: 4,
    author: "Pak Hendra",
    avatar: "PH",
    title: "Cara simpan benih padi yang baik untuk musim depan",
    content: "Setiap tahun saya sering gagal menyimpan benih sampai musim tanam berikutnya. Selalu berjamur atau daya kecambahnya turun. Ada tips menyimpan benih dengan benar?",
    tags: ["benih", "padi", "penyimpanan"],
    likes: 7,
    replies: [
      { id: 1, author: "Bu Dewi", avatar: "BD", content: "Keringkan benih sampai kadar air <12%, masukkan ke kantong plastik kedap udara + silica gel. Simpan di tempat sejuk dan kering.", time: "2 hari lalu" },
      { id: 2, author: "Kang Udin", avatar: "KU", content: "Saya biasa campur benih dengan abu dapur sebelum disimpan, alami tapi terbukti cegah jamur dan serangga.", time: "1 hari lalu" },
    ],
    time: "2 hari lalu",
    pinned: false,
  },
];

function Forum() {
  const { user } = useAuth();
  const [threads, setThreads]     = useState(INITIAL_THREADS);
  const [newTitle, setNewTitle]   = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags]     = useState("");
  const [replyText, setReplyText] = useState({});
  const [openThread, setOpenThread] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [likedThreads, setLikedThreads] = useState(new Set());

  const handlePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const thread = {
      id: Date.now(),
      author: user?.name || "Petani",
      avatar: (user?.name || "P").substring(0, 2).toUpperCase(),
      title: newTitle,
      content: newContent,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      likes: 0,
      replies: [],
      time: "Baru saja",
      pinned: false,
    };
    setThreads([thread, ...threads]);
    setNewTitle(""); setNewContent(""); setNewTags("");
    setShowForm(false);
    setOpenThread(thread.id);
  };

  const handleReply = (threadId) => {
    const text = replyText[threadId]?.trim();
    if (!text) return;
    const reply = {
      id: Date.now(),
      author: user?.name || "Petani",
      avatar: (user?.name || "P").substring(0, 2).toUpperCase(),
      content: text,
      time: "Baru saja",
    };
    setThreads(threads.map(t =>
      t.id === threadId ? { ...t, replies: [...t.replies, reply] } : t
    ));
    setReplyText({ ...replyText, [threadId]: "" });
  };

  const handleLike = (threadId) => {
    if (likedThreads.has(threadId)) return;
    setThreads(threads.map(t =>
      t.id === threadId ? { ...t, likes: t.likes + 1 } : t
    ));
    setLikedThreads(new Set([...likedThreads, threadId]));
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1>💬 Community Forum</h1>
            <p>Berbagi pengalaman dan belajar bersama sesama petani</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Batal" : "+ Buat Thread"}
          </button>
        </div>

        {/* New thread form */}
        {showForm && (
          <div className="card forum__new-card">
            <h3>Buat Thread Baru</h3>
            <form onSubmit={handlePost} className="forum__new-form">
              <div className="form-group">
                <label>Judul</label>
                <input className="form-control" value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Tulis judul pertanyaan atau topik Anda..." required />
              </div>
              <div className="form-group">
                <label>Isi</label>
                <textarea className="form-control" value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Jelaskan pertanyaan atau pengalaman Anda secara detail..."
                  rows={4} style={{ resize: "vertical" }} required />
              </div>
              <div className="form-group">
                <label>Tags (pisahkan dengan koma)</label>
                <input className="form-control" value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="Contoh: padi, hama, pupuk" />
              </div>
              <button type="submit" className="btn btn-primary">Posting Thread</button>
            </form>
          </div>
        )}

        {/* Thread list */}
        <div className="forum__list">
          {threads.map((thread) => {
            const isOpen = openThread === thread.id;
            return (
              <div key={thread.id} className={"card forum__thread" + (thread.pinned ? " forum__thread--pinned" : "")}>
                {thread.pinned && <div className="forum__pin-badge">📌 Disematkan</div>}

                <div className="forum__thread-header">
                  <div className="forum__avatar">{thread.avatar}</div>
                  <div className="forum__thread-main">
                    <h3
                      className="forum__thread-title"
                      onClick={() => setOpenThread(isOpen ? null : thread.id)}
                    >
                      {thread.title}
                    </h3>
                    <div className="forum__thread-meta">
                      <span className="forum__author">{thread.author}</span>
                      <span className="forum__dot">·</span>
                      <span className="forum__time">{thread.time}</span>
                      {thread.tags.map(tag => (
                        <span key={tag} className="badge badge-gray forum__tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="forum__thread-stats">
                    <button
                      className={"forum__like-btn" + (likedThreads.has(thread.id) ? " forum__like-btn--liked" : "")}
                      onClick={() => handleLike(thread.id)}
                      title="Suka"
                    >
                      👍 {thread.likes}
                    </button>
                    <button
                      className="forum__reply-count"
                      onClick={() => setOpenThread(isOpen ? null : thread.id)}
                    >
                      💬 {thread.replies.length}
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="forum__thread-body">
                    <p className="forum__thread-content">{thread.content}</p>
                    <hr className="divider" />

                    {/* Replies */}
                    {thread.replies.length > 0 && (
                      <div className="forum__replies">
                        {thread.replies.map(reply => (
                          <div key={reply.id} className="forum__reply">
                            <div className="forum__avatar forum__avatar--sm">{reply.avatar}</div>
                            <div className="forum__reply-body">
                              <div className="forum__reply-meta">
                                <span className="forum__author">{reply.author}</span>
                                <span className="forum__time">{reply.time}</span>
                              </div>
                              <p>{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input */}
                    <div className="forum__reply-input">
                      <div className="forum__avatar forum__avatar--sm">
                        {(user?.name || "P").substring(0, 2).toUpperCase()}
                      </div>
                      <div className="forum__reply-form">
                        <input
                          className="form-control"
                          placeholder="Tulis balasan Anda..."
                          value={replyText[thread.id] || ""}
                          onChange={e => setReplyText({ ...replyText, [thread.id]: e.target.value })}
                          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(thread.id); } }}
                        />
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleReply(thread.id)}
                          disabled={!replyText[thread.id]?.trim()}
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Forum;
