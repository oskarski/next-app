import { Suspense } from "react";
import { GeneratedAt } from "../../components/GeneratedAt";
import { H1 } from "../../components/H1";
import { StatCard } from "../../components/StatCard";
import { sleep } from "../../utils/sleep";
import { TaskStats, TasksSkeleton } from "./TaskStats";
import { CompleteButton } from "./CompleteButton";
import Link from "next/link";
import { TaskSearchInput } from "./TaskSearchInput";

// Wymuszenie aby strona byla generowana na zadanie ( next.js domyslnie bedzie probowal wygenerowac strony statyczne )
export const dynamic = 'force-dynamic';

const listTasks = (query) => fetch(`http://localhost:3003/tasks?q=${query || ''}`)
    .then(res => res.json());

// Moge oznaczyc komponnet serwerowy jako async. Dzieki czemu w ramach renderowania tego komponentu, moge poczekac ( await ) na pobranie danych i dopiero na ich podstawie wyrenderowac HTML
export default async function TaskListPage(props) {
    // W props mam informacje o search paramasach
    const tasks = await listTasks(props.searchParams.search);   

    return (
        <>
            <H1>Lista Zadan</H1>

            <GeneratedAt />

            {/* Czekajac na wygenerowanie i pobranie <TaskStats /> wyswietl <TasksSkeleton /> */}
            {/* UWAGA: Suspense jest z react!  */}
            {/* Komentuje, poniewaz dlugo trwaladowanie tej sekcji  */}
            {/* <Suspense fallback={<TasksSkeleton />}>
                <TaskStats />
            </Suspense> */}

            <TaskSearchInput />

            {tasks.length === 0 && <p>Brak zadan do zrobienia :)</p>}

            {tasks.length > 0 && (
                <ul className="px-6 mt-8 space-y-2">
                    {tasks.map(task => (
                        // Dodajemy klase line-through tylko dla ukonczonych zadan
                        <li key={task.id} className={`border border-gray-400 p-4 ${task.completed ? 'line-through' : ''}`}>
                            {/* Wyswietlamy przycisk tylko wtedy, kiedy zadanie jest nieukonczone */}
                            {!task.completed && <CompleteButton taskId={task.id} />}
                            {task.title} <time className="text-xs italic inline-block mr-2">{task.dueDate}</time>
                            <Link href={`/tasks/${task.id}/edit`}>Edytuj</Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}