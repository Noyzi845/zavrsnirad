"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPerson(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await prisma.person.create({ data: { name } });
  revalidatePath("/people");
}

export async function deletePerson(id: string) {
  await prisma.person.delete({ where: { id } });
  revalidatePath("/people");
}

export async function addAssignment(formData: FormData) {
  const dateStr = String(formData.get("date") || "");
  const personId = String(formData.get("personId") || "");
  const taskId = String(formData.get("taskId") || "");

  if (!dateStr || !personId || !taskId) return;

  const date = new Date(dateStr + "T00:00:00");

  await prisma.assignment.create({
    data: { date, personId, taskId },
  });

  revalidatePath("/");
}

export async function toggleDone(id: string, done: boolean) {
  await prisma.assignment.update({ where: { id }, data: { done } });
  revalidatePath("/");
}

export async function deleteAssignment(id: string) {
  await prisma.assignment.delete({ where: { id } });
  revalidatePath("/");
}