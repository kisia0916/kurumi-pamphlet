export default function MaintenancePage() {
  return (
    <main className="min-h-[100dvh] w-full bg-white flex items-center justify-center px-6">
      <section className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p
          className="inline-block w-fit text-sm font-semibold tracking-widest"
          style={{
            backgroundImage: "linear-gradient(90deg, #ec4899 0%, #f472b6 30%, #f59e0b 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          Kurumi Project
        </p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900">ただいま準備中です</h1>
        <p className="mt-4 text-zinc-600 leading-7">
          公開準備が完了するまで、現在のページはご利用いただけません。しばらくしてから再度アクセスしてください。
        </p>
      </section>
    </main>
  );
}
