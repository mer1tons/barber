"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDuration, formatLongDate, todayISO } from "@/lib/time";
import { ArrowIcon, CheckIcon, ClockIcon, CloseIcon } from "@/components/icons";

type Row = {
  booking: {
    id: number;
    code: string;
    date: string;
    startMinutes: number;
    endMinutes: number;
    customerName: string;
    phone: string;
    email: string | null;
    notes: string | null;
    status: "pending" | "confirmed" | "cancelled" | "completed";
  };
  service: string | null;
  barber: string | null;
};

const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const STATUS_STYLE: Record<string, string> = {
  pending: "border-brass/50 text-brass",
  confirmed: "border-moss/50 text-moss",
  cancelled: "border-rust/50 text-rust",
  completed: "border-line text-bone-3",
};

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (token: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ date, status });
        const res = await fetch(`/api/bookings?${params}`, {
          headers: { "x-admin-code": token },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthed(false);
          sessionStorage.removeItem("sj_admin");
          setError(data?.error ?? "Nuk u ngarkuan të dhënat.");
          return;
        }
        setRows(data.bookings as Row[]);
      } catch {
        setError("Lidhja dështoi.");
      } finally {
        setLoading(false);
      }
    },
    [date, status],
  );

  useEffect(() => {
    const saved = sessionStorage.getItem("sj_admin");
    if (saved) {
      setCode(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed && code) void load(code);
  }, [authed, code, load]);

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    sessionStorage.setItem("sj_admin", code);
    setAuthed(true);
  };

  const changeStatus = async (id: number, next: string) => {
    const row = rows.find((r) => r.booking.id === id);
    if (!row) return;
    const res = await fetch(`/api/bookings/${row.booking.code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-code": code },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setRows((cur) =>
        cur.map((r) =>
          r.booking.id === id ? { ...r, booking: { ...r.booking, status: next as Row["booking"]["status"] } } : r,
        ),
      );
    } else {
      setError(data?.error ?? "Ndryshimi dështoi");
    }
  };

  const active = rows.filter((r) => r.booking.status !== "cancelled");

  if (!authed) {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-ink px-5">
        <div className="w-full max-w-md border border-line/70 bg-ink-2 p-8">
          <p className="eyebrow">Paneli i studios</p>
          <h1 className="display mt-4 text-5xl text-bone">Hyrja</h1>
          <p className="mt-3 text-sm text-bone-3">
            Fut kodin e administratorit për të parë agjendën e termineve.
          </p>
          <form onSubmit={unlock} className="mt-8 space-y-4">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kodi i adminit"
              className="field font-mono tracking-[0.2em]"
              autoFocus
            />
            <button type="submit" className="btn w-full">
              <span>Hyr</span>
              <ArrowIcon className="h-4 w-4" />
            </button>
          </form>
          {attempted && error && <p className="mt-4 text-sm text-rust">{error}</p>}
          <a href="/" className="mt-6 block font-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-3 hover:text-brass">
            ← Kthehu në faqen kryesore
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-ink pb-24">
      <header className="border-b border-line/70 bg-ink-2">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-6 lg:px-10">
          <div>
            <p className="eyebrow">Paneli i studios</p>
            <h1 className="display mt-2 text-4xl text-bone">Agjenda e termineve</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="btn btn-ghost !py-3">
              <span>Faqja</span>
            </a>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("sj_admin");
                setAuthed(false);
              }}
              className="border border-line px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone-3 hover:border-rust hover:text-rust"
            >
              Dil
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pt-8 lg:px-10">
        <div className="flex flex-wrap items-end gap-4 border border-line/70 bg-ink-2 p-5">
          <label className="block">
            <span className="eyebrow mb-2 block">Data</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field max-w-[200px]" />
          </label>
          <label className="block">
            <span className="eyebrow mb-2 block">Statusi</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="field max-w-[200px]">
              <option value="all">Të gjithë</option>
              <option value="confirmed">Të konfirmuar</option>
              <option value="pending">Në pritje</option>
              <option value="completed">Të përfunduar</option>
              <option value="cancelled">Të anuluar</option>
            </select>
          </label>
          <button type="button" onClick={() => void load(code)} className="btn !py-3">
            <span>Rifresko</span>
          </button>
          <div className="ml-auto flex gap-6">
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone-3">Terminë aktivë</p>
              <p className="display text-4xl text-brass">{active.length}</p>
            </div>
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone-3">Minuta</p>
              <p className="display text-4xl text-bone">
                {active.reduce((s, r) => s + (r.booking.endMinutes - r.booking.startMinutes), 0)}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone-3">
          {formatLongDate(date)} · {rows.length} regjistrime
        </p>

        {error && <p className="mt-4 border border-rust/50 bg-rust/10 px-4 py-3 text-sm">{error}</p>}

        <div className="mt-4 overflow-x-auto border border-line/70">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-char">
              <tr className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-bone-3">
                <th className="px-4 py-4">Ora</th>
                <th className="px-4 py-4">Kodi</th>
                <th className="px-4 py-4">Klienti</th>
                <th className="px-4 py-4">Shërbimi</th>
                <th className="px-4 py-4">Berberi</th>
                <th className="px-4 py-4">Statusi</th>
                <th className="px-4 py-4 text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center font-mono text-xs text-bone-3">
                    Duke ngarkuar…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center font-mono text-xs text-bone-3">
                    Asnjë term për këtë ditë.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((r) => (
                  <tr key={r.booking.id} className="border-t border-line/60 transition-colors hover:bg-char/50">
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 font-mono text-sm text-bone">
                        <ClockIcon className="h-4 w-4 text-brass" />
                        {hhmm(r.booking.startMinutes)}–{hhmm(r.booking.endMinutes)}
                      </span>
                      <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-[0.16em] text-bone-3">
                        {formatDuration(r.booking.endMinutes - r.booking.startMinutes)}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm text-brass">{r.booking.code}</td>
                    <td className="px-4 py-4">
                      <span className="block text-sm text-bone">{r.booking.customerName}</span>
                      <a
                        href={`tel:${r.booking.phone.replace(/\s/g, "")}`}
                        className="block font-mono text-[0.6rem] text-bone-3 hover:text-brass"
                      >
                        {r.booking.phone}
                      </a>
                      {r.booking.notes && (
                        <span className="mt-1 block max-w-[240px] text-[0.7rem] italic text-bone-3">
                          “{r.booking.notes}”
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-bone-2">{r.service ?? "—"}</td>
                    <td className="px-4 py-4 text-sm text-bone-2">{r.barber ?? "—"}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`border px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] ${
                          STATUS_STYLE[r.booking.status]
                        }`}
                      >
                        {r.booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {r.booking.status !== "cancelled" && (
                          <>
                            <button
                              type="button"
                              onClick={() => void changeStatus(r.booking.id, "completed")}
                              title="Shëno si të përfunduar"
                              className="grid h-8 w-8 place-items-center border border-line text-bone-2 hover:border-moss hover:text-moss"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void changeStatus(r.booking.id, "cancelled")}
                              title="Anulo"
                              className="grid h-8 w-8 place-items-center border border-line text-bone-2 hover:border-rust hover:text-rust"
                            >
                              <CloseIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {r.booking.status === "cancelled" && (
                          <button
                            type="button"
                            onClick={() => void changeStatus(r.booking.id, "confirmed")}
                            className="border border-line px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-bone-2 hover:border-brass hover:text-brass"
                          >
                            Rikthe
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
