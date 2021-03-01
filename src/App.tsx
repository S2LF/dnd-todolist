import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

type ColumnType = {
  children: JSX.Element | boolean;
  className: string;
  title: string;
};

type MovableItemType = {
  setIsFirstColumn: React.Dispatch<React.SetStateAction<boolean>>;
};

const MovableItem = ({ setIsFirstColumn }: MovableItemType) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name: 'Any custom name', type: 'Our first type' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.name === 'Column 1') {
        setIsFirstColumn(true);
      } else {
        setIsFirstColumn(false);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} className="movable-item" style={{ opacity }}>
      We will move this item
    </div>
  );
};

const Column = ({ children, className, title }: ColumnType) => {
  const [, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: title }),
  });

  return (
    <div ref={drop} className={className}>
      {title}
      {children}
    </div>
  );
};

export default function App(): JSX.Element {
  const [isFirstColumn, setIsFirstColumn] = useState(true);

  const Item = <MovableItem setIsFirstColumn={setIsFirstColumn} />;

  return (
    <div className="container">
      <DndProvider backend={HTML5Backend}>
        <Column title="Column 1" className="column first-column">
          {isFirstColumn && Item}
        </Column>
        <Column title="Column 2" className="column second-column">
          {!isFirstColumn && Item}
        </Column>
      </DndProvider>
    </div>
  );
}
