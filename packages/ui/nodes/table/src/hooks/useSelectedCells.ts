import { useEffect } from 'react';
import { useEditorRef } from '@udecode/plate-core';
import { getTableGridAbove } from '@udecode/plate-table';
import { useAtom } from 'jotai';
import { useReadOnly, useSelected } from 'slate-react';
import { selectedCellsAtom } from '../table.atoms';

/**
 * Many grid cells above and diff -> set
 * No many grid cells above and diff -> unset
 * No selection -> unset
 */
export const useSelectedCells = () => {
  const readOnly = useReadOnly();
  const selected = useSelected();
  const editor = useEditorRef();

  const [selectedCells, setSelectedCells] = useAtom(selectedCellsAtom);

  useEffect(() => {
    if (!selected || readOnly) setSelectedCells(null);
  }, [selected, editor, setSelectedCells, readOnly]);

  useEffect(() => {
    if (readOnly) return;

    const cellEntries = getTableGridAbove(editor, { format: 'cell' });
    if (cellEntries.length > 1) {
      const cells = cellEntries.map((entry) => entry[0]);

      if (JSON.stringify(cells) !== JSON.stringify(selectedCells)) {
        setSelectedCells(cells);
      }
    } else if (selectedCells) {
      setSelectedCells(null);
    }
  }, [editor, editor.selection, readOnly, selectedCells, setSelectedCells]);
};
