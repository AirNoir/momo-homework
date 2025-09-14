"use client";

import { DragDropContext } from "@hello-pangea/dnd";

interface DragDropProviderProps {
  children: React.ReactNode;
}

export default function DragDropProvider({ children }: DragDropProviderProps) {
  return <DragDropContext onDragEnd={() => {}}>{children}</DragDropContext>;
}
