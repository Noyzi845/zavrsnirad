import { prisma } from "@/lib/prisma";
import { addTask, deleteTask } from "./actions";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Poslovi</h1>

      {/* forma za dodavanje */}
      <form action={addTask} className="flex gap-2">
        <input
          name="title"
          placeholder="Naziv posla (npr. usisavanje)"
          className="border rounded px-3 py-2 flex-1"
        />
        <button className="border rounded px-4 py-2">
          Dodaj
        </button>
      </form>

      {/* lista poslova */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border rounded px-3 py-2 flex justify-between items-center"
          >
            <span>{task.title}</span>

            <form
              action={async () => {
                "use server";
                await deleteTask(task.id);
              }}
            >
              <button className="text-red-600">
                Obriši
              </button>
            </form>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="text-sm text-gray-600">
          Nema dodanih poslova.
        </p>
      )}
    </main>
  );
}