import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;

  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ active?: boolean; isArrow?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: all 0.3s ease;
  font-weight: ${({ active }) => (active ? '600' : 'normal')};

  background-color: ${({ active, isArrow }) =>
    active && !isArrow ? '#058E3A' : '#F5F5F5'};
  color: ${({ active, isArrow }) =>
    active && !isArrow ? 'white' : '#333'};

  &:hover:not(:disabled) {
    background-color: ${({ isArrow }) => (isArrow ? '#e0e0e0' : '#e0e0e0')};
  }

  &:active {
    background-color: ${({ isArrow }) => (isArrow ? '#d5d5d5' : '#058E3A')};
    color: ${({ isArrow }) => (isArrow ? '#333' : 'white')};
  }
`;


const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}> = ({ currentPage, totalPages, paginate }) => {
  return (
    <PaginationContainer>
      <PageButton
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </PageButton>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <PageButton
          key={number}
          onClick={() => paginate(number)}
          active={currentPage === number}
        >
          {number}
        </PageButton>
      ))}
      
      <PageButton
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;