import { prisma } from "@/lib/prisma";
import { addAssignment, deleteAssignment, toggleDone } from "./people/actions";
import { Person, Task, Assignment } from "@prisma/client";

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { date?: string };
}) {
  const selectedDate = await searchParams?.date ? new Date(searchParams.date + "T00:00:00") : new Date();
  const dateStr = toISODate(selectedDate);

 const [people, tasks, assignments]: [
  Person[],
  Task[],
  (Assignment & { person: Person; task: Task })[]
] = await Promise.all([
  prisma.person.findMany({ orderBy: { name: "asc" } }),
  prisma.task.findMany({ orderBy: { title: "asc" } }),
  prisma.assignment.findMany({
    where: { date: new Date(dateStr + "T00:00:00") },
    include: { person: true, task: true },
  }),
]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Raspored kućanskih poslova</h1>

      <form className="flex gap-2 items-center" action="">
        <label className="text-sm">Datum:</label>
        <input
          type="date"
          name="date"
          defaultValue={dateStr}
          className="border rounded px-3 py-2"
        />
        <button className="border rounded px-4 py-2">Prikaži</button>
      </form>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Dodijeli posao</h2>

        <form action={addAssignment} className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input type="hidden" name="date" value={dateStr} />

          <select name="personId" className="border rounded px-3 py-2">
            <option value="">Osoba</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select name="taskId" className="border rounded px-3 py-2">
            <option value="">Posao</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>

          <button className="border rounded px-4 py-2">Dodijeli</button>
        </form>

        {people.length === 0 || tasks.length === 0 ? (
          <p className="text-sm text-gray-600">
            Dodaj barem jednu osobu i jedan posao u izbornicima (/people, /tasks).
          </p>
        ) : null}
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Dodjele za {dateStr}</h2>

        <ul className="space-y-2">
          {assignments.map((a) => (
            <li key={a.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {a.task.title} → {a.person.name}
                </div>
                <div className="text-sm text-gray-600">
                  Status: {a.done ? "odradeno" : "nije odradeno"}
                </div>
              </div>

              <div className="flex gap-3">
                <form
                  action={async () => {
                    "use server";
                    await toggleDone(a.id, !a.done);
                  }}
                >
                  <button className="border rounded px-3 py-1">
                    {a.done ? "Vrati" : "Done"}
                  </button>
                </form>

                <form
                  action={async () => {
                    "use server";
                    await deleteAssignment(a.id);
                  }}
                >
                  <button className="text-red-600">Obriši</button>
                </form>
              </div>
            </li>
          ))}
        </ul>

        {assignments.length === 0 ? (
          <p className="text-sm text-gray-600">Nema dodjela za ovaj datum.</p>
        ) : null}
      </section>
    </main>
  );
}