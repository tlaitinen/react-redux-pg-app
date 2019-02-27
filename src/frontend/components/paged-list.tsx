import React from 'react';
import {
  Table,
  Checkbox,
  Alert
} from 'react-bootstrap';
import Pagination from './pagination';
import LoadingMask from './loading-mask';

export interface Props {
  loading?: boolean;
  children: React.ReactNode;
  error?: React.ReactNode;
  pages: number;
  page: number;
  rowsPerPage: number;
  selectPage: (p:number) => void;
  selectable?:boolean;
  isSelected?: (index:number) => boolean;
  onSelect: (index:number) => void;
  renderRow: (index:number) => React.ReactNode;
}
const PagedList = (props:Props) => {
  const {
    children,
    loading,
    page,
    pages,
    rowsPerPage,
    selectPage,
    selectable,
    renderRow,
    onSelect,
    isSelected,
    error
  } = props;
  
  return (
    <div style={{position:'relative'}}>
      <LoadingMask loading={loading || false}/>
      <Table responsive striped hover>
        <thead>
          <tr>
            {selectable ? <th></th> : null}
            {children}
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage).keys()].map((i:number) => {
            if (i < 100) {
            }
            const row = renderRow(i);
            if (row) {
              return (
                <tr key={i}>
                  {selectable && isSelected
                    ? <td>
                      <Checkbox checked={isSelected(i)}
                        onClick={() => onSelect(i)}/>
                    </td> : null}
                  {row}
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </Table>
      {pages > 1 
        ? <div className='text-center'>
          <Pagination page={page} pages={pages} selectPage={selectPage}/>    
        </div> : null}
      {error 
        ? <Alert bsStyle='danger'>
          {error}
        </Alert> : null}
    </div>
  );
}
export default PagedList;
