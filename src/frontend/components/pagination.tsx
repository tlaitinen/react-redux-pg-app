import React from 'react';
import {
  Pagination
} from 'react-bootstrap';


interface Props {
  pages: number;
  page: number;
  selectPage: (p:number) => void;
}
const Pagination_ = (props:Props) => {
  const {page, pages, selectPage} = props;
  const pageButtons:(number|'ellipsis')[] = [0];

  if (page >= 5) {
    pageButtons.push('ellipsis');
  }
  for (let p = pages - 5; p < pages; p++) {
    if (p >= 1) {
      pageButtons.push(p);
    }
  }
  return (
    <Pagination>
      {pageButtons.map((p:number | 'ellipsis') => {
        if (p === 'ellipsis') {
          return <Pagination.Ellipsis/>;
        } else {
          return (
            <Pagination.Item key={p} active={p === page} 
              onClick={p !== page ? () => selectPage(p) : undefined}>
              {p+1}
            </Pagination.Item>
          );
        }
      })}
    </Pagination>
  );
};
export default Pagination_;
