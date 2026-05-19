import { prisma } from "@/lib/prisma";
import { addPerson, deletePerson } from "./actions";
import { Person } from "@prisma/client";

export default async function PeoplePage() {
  const people: Person[] = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
  });
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Osobe</h1>

      <form action={addPerson} className="flex gap-2">
        <input
          name="name"
          placeholder="Ime osobe"
          className="border rounded px-3 py-2 flex-1"
        />
        <button className="border rounded px-4 py-2">Dodaj</button>
      </form>

      <ul className="space-y-2">
        {people.map((p) => (
          <li key={p.id} className="border rounded px-3 py-2 flex justify-between">
            <span>{p.name}</span>
            <form action={async () => { "use server"; await deletePerson(p.id); }}>
              <button className="text-red-600">Obriši</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
