/**
 * vt.matrix.js
 *
 * vt.matrix.js es una librería de funciones para manipulacion básica de matrices.
 *
 *
 * Copyright 2013 Roimer Garcia (@roimergarcia)
 *
 * Liberado bajo licencia CC BY-SA 3.0, disponible en:
 * http://creativecommons.org/licenses/by-sa/3.0/deed.es
 * 
 * ------------------------------------------------
 *  author:  Roimer Garcia
 *  version: 0.1
 *  web:     http://variabletecnica.com//
 *  source:  https://github.com/roimergarcia/vt.matrix.js/
 */
(function(global){
  global.vt = global.vt || {};
  
  //Constructor
  global.vt.Matrix = function Matrix(data){
    
    //Verificamos que sea un arreglo bidimensional, con al menos una fila y una columna  
    if ( !data || !Array.isArray(data) || data.length==0 || !Array.isArray(data[0])  || data[0].length==0 ) {
      return null;
    }
    
    this._data = data;
    
  };
  
  //Devuelve la matriz de datos subyacente
  global.vt.Matrix.prototype.getData = function(){
    return this._data; 
  };
  
  //Devuelve el número de filas de la matriz
  global.vt.Matrix.prototype.getRows = function(){
    return this._data.length; 
  };

  //Devuelve el número de columnas la matriz
  global.vt.Matrix.prototype.getCols = function(){
    if(this._data.length>0){
      return this._data[0].length
    }else{
      return 0;
    }
  };
  
  //Devuelve la representación de cadena de la matriz
  global.vt.Matrix.prototype.toString = function(){
    var data = this._data,
        nRows = this.getRows(),
        nCols = this.getCols();
    
    if ( nRows==0 || nCols==0) {
      return "[[?]]";
    };
    
    var cadena = [];
    cadena.push("[");
    for (var i=0; i<nRows; i++) {
      cadena.push("[");
      for (var j=0; j<nCols; j++) {
        cadena.push(data[i][j]);
        if ( j<nCols-1 ){
          cadena.push(",");
        }
      };
      cadena.push("]");
      if ( i<nRows-1 ){
        cadena.push(",");
      }
    }
    cadena.push("]");
    return cadena.join("");
  };
  
  //Devuelve un valor lógico que indica si la matriz es cuadrada
  global.vt.Matrix.prototype.isSquared = function(){
    if ( this._data.length==0 ) {
      return false;
    };
    if (this._data[0].length==0) {
      return false;
    };
    
    return ( this._data.length == this._data[0].length);
    
  }
  
  //Crea una matriz del tamaño indicado, rellena con ceros
  global.vt.Matrix.newMatrix = function(nRows, nCols){
  
    var data = [],
        row;
    nRows = Math.max(nRows||1, 1);
    nCols = Math.max(nCols||1, 1);
    
    for (var i=0; i<nRows; i++) {
      row = [];
      for (var j=0; j<nCols; j++) {
        row.push(0);
      }
      data.push(row);
    };
    
    return new global.vt.Matrix(data);
  };
  
  //Devuelve una nueva matriz que es la transpuesta de la indicada
  global.vt.Matrix.transpose = function(matrix){
    var data,
        nRows,
        nCols,
        newData = [];
        
    if( !(matrix instanceof vt.Matrix) ){
      return null;
    }

    data = matrix._data;
    nRows = matrix.getRows();
    nCols = matrix.getCols();
    
    for(var j=0; j<nCols; j++){
      newData.push([])
      for(var i=0; i<nRows; i++){
        newData[j].push(data[i][j]);
      };
    };
    
    return new global.vt.Matrix(newData);
  };
  
  //Devuelve una nueva matriz que es el producto de un escalar por la matriz indicada
  global.vt.Matrix.scalarMultiply = function(scalar, matrix){
    var data,
        nRows,
        nCols,
        newData = [];
        
    if( !(matrix instanceof vt.Matrix) ){
      return null;
    };
    if(typeof scalar !== 'number'){
      return null;
    };
    
    data = matrix._data;
    nRows = matrix.getRows();
    nCols = matrix.getCols();
        
    for(var i=0; i<nRows; i++){
      newData.push([])
      for(var j=0; j<nCols; j++){
        newData[i].push(scalar*data[i][j]);
      };
    };
    
    return new global.vt.Matrix(newData);
  };

  //Devuelve el determinante de la matriz indicada
  global.vt.Matrix.determinant = function(matrix){
    var data,
        nRows,
        nCols;
        
    if ( !(matrix instanceof vt.Matrix) ) {
      return null;
    };
    
    //Solo las matrices cuadradas tienen determinante
    if ( !matrix.isSquared() ) {
      return null;
    };
    
    data = matrix._data;
    nRows = matrix.getRows();
    nCols = matrix.getRows();
    
    if(nRows===1){
      return data[0][0];
    };
    //Regla de Sarrus para n=2
    if(nRows===2){
      return (data[0][0]*data[1][1] - data[0][1]*data[1][0]);
    };
    //Regla de Sarrus para n=3
    if(nRows===3){
      return (data[0][0]*data[1][1]*data[2][2] + data[0][1]*data[1][2]*data[2][0] + data[0][2]*data[1][0]*data[2][1]) 
             -((data[2][0]*data[1][1]*data[0][2] + data[2][1]*data[1][2]*data[0][0] + data[2][2]*data[1][0]*data[0][1]));
    };
    
    return null;
  };

  //Devuelve un escalar que es el cofactor ij de la matriz indicada. 
  global.vt.Matrix.cofactor = function(i, j, matrix){
    var data,
        nRows,
        nCols,
        newData = [],
        minnor,
        nDeterminant;
 
    if ( !(matrix instanceof vt.Matrix) ) {
      return null;
    };
    
    //Solo las matrices cuadradas tienen determinante (y, por tanto, cofactor)
    if ( !matrix.isSquared() ) {
      return null;
    };    

    if ( typeof i !== 'number' || typeof j !== 'number' ) {
      return null;
    };
    
    data = matrix._data;
    nRows = matrix.getRows();
    nCols = matrix.getRows();
    
    //Verifica los límites
    if ( nRows==0 || i <= 0 || i> nRows || j <= 0 || j> nCols ) {
      return null;
    };
    
    //Empieza el cálculo: elimina la fila i y columna j 
    for (var p=0; p<nRows; p++) {
      if (p===i-1){
        continue;
      };
      newData.push([]);
      for (var q=0; q<nCols;q++) {
        if (q===j-1){
          continue;
        };
        newData[newData.length-1].push(data[p][q]);
      };
    };
    
    minnor = new global.vt.Matrix(newData);
    
    nDeterminant = global.vt.Matrix.determinant(minnor);
    
    return Math.pow(-1,i+j)*nDeterminant;
    
  };
    
})(this);
