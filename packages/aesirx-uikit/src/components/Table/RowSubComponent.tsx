/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';

/**
 * Renders the sub rows for a given row in a table.
 * @param row - The parent row.
 * @param rowProps - The props for the parent row.
 * @param visibleColumns - The visible columns in the table.
 * @param data - The data for the sub rows.
 * @param loading - Flag indicating if the data is still loading.
 * @returns The JSX element representing the sub rows.
 */

function SubRows({
  row,
  rowProps,
  visibleColumns,
  data,
  loading,
}: {
  row: any;
  rowProps: any;
  visibleColumns: any[];
  data: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <tr>
        <td />
        <td colSpan={visibleColumns.length - 1}>Loading...</td>
      </tr>
    );
  }

  return (
    <>
      {data && (
        <>
          {data.map((x: any, i: number) => {
            return (
              <tr
                {...rowProps}
                key={`${rowProps.key}-expanded-${i}`}
                className="border-bottom row_sub_component"
              >
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={`px-2 py-3 sub-cell-${cell.column.id} `}
                    >
                      {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                        value: cell.column.accessor && cell.column.accessor(x, i),
                        row: { ...row, original: x },
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </>
      )}
    </>
  );
}

/**
 * Renders the sub rows asynchronously.
 *
 * @param {object} args - The function arguments.
 * @param {object} args.row - The row object.
 * @param {object} args.rowProps - The row props object.
 * @param {array} args.visibleColumns - The array of visible columns.
 * @param {object} args.listViewModel - The list view model object.
 * @param {string} args.idKey - The ID key string.
 *
 * @returns {JSX.Element} - The rendered sub rows.
 */

const SubRowAsync = ({
  row,
  rowProps,
  visibleColumns,
  listViewModel,
  idKey,
}: {
  row: any;
  rowProps: any;
  visibleColumns: any[];
  listViewModel: any;
  idKey: string;
}): JSX.Element => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const data = React.useRef<any[]>([]);

  React.useEffect(() => {
    (async function () {
      try {
        if (idKey) {
          data.current = await listViewModel?.getContentByIdExpanded(row.original[idKey]);
        }

        setLoading(false);
      } catch (e) {
        // console.error(e);
      }
    })();
  }, [listViewModel, row, idKey]);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      data={data.current}
      loading={loading}
    />
  );
};

export default SubRowAsync;
