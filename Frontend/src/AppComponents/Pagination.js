import React, { Fragment } from "react";
import { connect } from 'react-redux';
import  './Pagination.scss';

const mapStateToProps = (state) => ({ 
  pageNeighbours: state.flats.pageNeighbours
});

function Pagination(props) {
  const LEFT_PAGE = 'LEFT';
  const RIGHT_PAGE = 'RIGHT';
  const range = (from, to, step = 1) => {
    let i = from;
    const range = [];
  
    while (i <= to) {
      range.push(i);
      i += step;
    }
  
    return range;
  }

  const fetchPageNumbers = () => {
    const totalNumbers = (props.pageNeighbours * 2) + 3;
    const totalBlocks = totalNumbers + 2;
    if (props.totalPages > totalBlocks) {
      const startPage = Math.max(2, props.pageNumber - props.pageNeighbours + 1);
      const endPage = Math.min(props.totalPages - 1, props.pageNumber + props.pageNeighbours + 1);
      let pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (props.totalPages - endPage) > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case (hasLeftSpill && hasRightSpill):
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, props.totalPages];
    }

    return range(1, props.totalPages);
  }

  const pages = fetchPageNumbers();

  const gotoPage = page => {
    const currentPage = Math.max(1, Math.min(page, props.totalPages));
    props.onChangingPage(currentPage-1);
  }

  const handleClick = page => evt => {
    evt.preventDefault();
    gotoPage(page);
  }

  const handleMoveLeft = evt => {
    evt.preventDefault();
    gotoPage(props.pageNumber - (props.pageNeighbours * 2));
  }

  const handleMoveRight = evt => {
    evt.preventDefault();
    gotoPage(props.pageNumber + (props.pageNeighbours * 2) + 2);
  }
  return (
    <div>
      { (!props.totalElements || props.totalElements === 0 || props.totalPages === 0) ? <div /> :
      <Fragment>
        <nav aria-label="Flats Pagination">
          <ul className="pagination">
            { pages.map((page, index) => {

              if (page === LEFT_PAGE) return (
                <li key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Previous" onClick={handleMoveLeft}>
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );

              if (page === RIGHT_PAGE) return (
                <li key={index} className="page-item">
                  <a className="page-link" href="#" aria-label="Next" onClick={handleMoveRight}>
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              );

              return (
                <li key={index} className={`page-item${ props.pageNumber == page-1 ? ' active' : ''}`}>
                  <a className="page-link" href="#" onClick={handleClick(page)}>{ page }</a>
                </li>
              );

            }) }

          </ul>
        </nav>
      </Fragment>}
    </div>
  )
}

export default connect(mapStateToProps, null)(Pagination);