
export default function generatePaginationNumbers( currentPage: number, totalPage: number):(number | string)[] {

  /* Si el numero total de paginas es 7 o menos se muestran todos sin puntos suspensivos */
  if (totalPage <= 7) {
    return Array.from({ length: totalPage }, (_, index) => index + 1); //[1,2,3,4,5,6,7]
  }

  /* Si la pagina actual esta entre las primeras 3 paginas mostrar las primeras 3 un punto
   suspensivo y las 2 ultimas */

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPage - 1, totalPage];
  }

  /** Si la pagina actual esta entre las ultimas 3 paginas mostrar las primeras 2 un punto
   *  suspensivo y las ultimas 3 */

  if (currentPage >= totalPage - 2) {
    return [1, 2, "...", totalPage - 2, totalPage - 1, totalPage];
  }


  /* Si la pagina actual esta entre las 3 primeras y las 2 ultimas */
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPage];
  
}