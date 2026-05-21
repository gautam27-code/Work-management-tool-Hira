import { useState, useMemo } from "react";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

function KanbanBoard({ tasks, onStatusChange }) {
  const [activeTask, setActiveTask] = useState(null);

  const columns = ["todo", "in_progress", "review", "done"];

  const tasksByColumn = useMemo(() => {
    const acc = { todo: [], in_progress: [], review: [], done: [] };
    tasks.forEach(task => {
      if (acc[task.status]) acc[task.status].push(task);
    });
    return acc;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Over can be a column or a task
    let newStatus = null;
    
    if (columns.includes(overId)) {
      newStatus = overId;
    } else {
      const overTask = tasks.find(t => t._id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && activeTask && activeTask.status !== newStatus) {
      onStatusChange(activeId, newStatus);
    }
  };

  return (
    <div className="flex h-full min-h-[600px] overflow-x-auto pb-4 gap-6 custom-scrollbar animate-fade-in">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <KanbanColumn id="todo" title="To Do" tasks={tasksByColumn.todo} color="bg-[#94a3b8]" />
        <KanbanColumn id="in_progress" title="In Progress" tasks={tasksByColumn.in_progress} color="bg-[#3b82f6]" />
        <KanbanColumn id="review" title="Review" tasks={tasksByColumn.review} color="bg-[#f59e0b]" />
        <KanbanColumn id="done" title="Done" tasks={tasksByColumn.done} color="bg-[#10b981]" />

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
