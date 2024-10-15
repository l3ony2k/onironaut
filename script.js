// document.addEventListener('DOMContentLoaded', () => {
//     const headers = document.querySelectorAll('.film-header .film-cell');
//     const rows = document.querySelectorAll('.film-row:not(.film-header)');

//     headers.forEach((header, index) => {
//         header.addEventListener('click', () => {
//             const sortedRows = Array.from(rows).sort((rowA, rowB) => {
//                 const cellA = rowA.querySelectorAll('.film-cell')[index].innerText.toLowerCase();
//                 const cellB = rowB.querySelectorAll('.film-cell')[index].innerText.toLowerCase();
                
//                 if (cellA < cellB) return -1;
//                 if (cellA > cellB) return 1;
//                 return 0;
//             });

//             sortedRows.forEach(row => document.querySelector('.film-table').appendChild(row));
//         });
//     });
// });
