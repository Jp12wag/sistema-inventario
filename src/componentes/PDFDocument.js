import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'left',
    padding: 5,
  },
  cell: {
    flex: 1,
  },
});

// Componente para el documento PDF
const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Reporte de Productos</Text>
        <View style={styles.row}>
          <Text style={styles.cell}>Nombre</Text>
          <Text style={styles.cell}>Descripción</Text>
          <Text style={styles.cell}>Categoría</Text>
          <Text style={styles.cell}>Precio</Text>
          <Text style={styles.cell}>Proveedor</Text>
          <Text style={styles.cell}>Cantidad</Text>
          <Text style={styles.cell}>Ubicación</Text>
        </View>
        {data.map((producto, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{producto.name}</Text>
            <Text style={styles.cell}>{producto.descripcion}</Text>
            <Text style={styles.cell}>{producto.categoría}</Text>
            <Text style={styles.cell}>{producto.precio}</Text>
            <Text style={styles.cell}>{producto.proveedor}</Text>
            <Text style={styles.cell}>{producto.stockInicial}</Text>
            <Text style={styles.cell}>{producto.ubicacion}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFDocument;