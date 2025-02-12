export const ModulosForPlan = [
  {
    activo: false,
    tipo: "gestionContable",
    text: "Contabilidad integrada con emisión de reportes financieros",
    value: "contabilidad-reportes",
    modulos: ["Contabilidad"],
  },
  {
    activo: false,
    tipo: "gestionContable",
    text: "Asientos contables mediante comprobantes contables",
    value: "contabilidad-comprobantes",
    modulos: ["Contabilidad"],
  },
  {
    activo: false,
    tipo: "gestionContable",
    text: "Módulo de conciliación bancaria",
    value: "contabilidad-conciliacion",
    modulos: ["Contabilidad"],
  },
  {
    activo: false,
    tipo: "gestionContable",
    text: "Módulo de activos fijos y calculo de depreciación",
    value: "contabilidad-activosFijos",
    modulos: ["Contabilidad"],
  },
  {
    activo: false,
    tipo: "gestionTributaria",
    text: "Gestión integrada de Libros fiscales por Ventas",
    value:
      "preguntar que vistas serian o que parte de vistas, esto incluye reportes, facturas por declarar y quizas planilla de iva",
    modulos: ["Tributos"],
  },
  {
    activo: false,
    tipo: "gestionTributaria",
    text: "Gestión integrada de Libros fiscales por Compras",
    value:
      "preguntar que vistas serian o que parte de vistas, esto incluye reportes, facturas por declarar y quizas planilla de iva",
    modulos: ["Tributos"],
  },
  {
    activo: false,
    tipo: "gestionTributaria",
    text: "Gestion integrada  Borrador Declaraciones de IVA",
    value: "esto debería de ser en mi opinion todo el panel tributario",
    modulos: ["Tributos"],
  },
  {
    activo: false,
    tipo: "gestionTributaria",
    text: "Gestión integrada de Retenciones de Impuestos",
    value: "esto debería de ser en mi opinion todo el panel tributario",
    modulos: ["Tributos"],
  },
  {
    activo: false,
    tipo: "gestionTributaria",
    text: "Libro fiscal de inventarios",
    value: "esto no se",
    modulos: ["Tributos"],
  },
  {
    activo: false,
    tipo: "gestionOperativa",
    text: "Facturación (Forma libre, máquina fiscal)",
    value: "ventas-crear",
    modulos: ["Facturación"],
  },
  {
    activo: false,
    tipo: "gestionOperativa",
    text: "Gestión integrada a puntos de ventas y cuadres de cajas",
    value: "ventas-cierres",
    modulos: ["Facturación"],
  },
  {
    activo: false,
    tipo: "gestionOperativa",
    text: "Gestión integrada de proveedores y compras",
    value: "compras",
    modulos: ["Compras"],
  },
  {
    activo: false,
    tipo: "gestionOperativa",
    text: "Inventarios, almacenes y zonas personalizables",
    value: "creo que seria todo inventario",
    modulos: ["Inventarios"],
  },
  {
    activo: false,
    tipo: "gestionFinanciera",
    text: "Cajas, bancos nacionales y bancos extranjeros",
    value: "tesoreria",
    modulos: ["Administración"],
  },
  {
    activo: false,
    tipo: "gestionFinanciera",
    text: "Gestión de cuentas por cobrar y análisis de antigüedad",
    value:
      "preguntar su solo seria de administracion o tambien limitar lo de ventas y compras",
    modulos: ["Administración", "Facturación"],
  },
  {
    activo: false,
    tipo: "gestionFinanciera",
    text: "Gestión de cuentas por pagar y vencimientos",
    value:
      "preguntar su solo seria de administracion o tambien limitar lo de ventas y compras",
    modulos: ["Administración", "Compras"],
  },
  {
    activo: false,
    tipo: "gestionFinanciera",
    text: "Gráficos financieros, rentabilidad, ventas, gastos, etc.",
    value: "esto es el home?",
  },
];
export const tiposPlanes = {
  comercial: "Plan Comercial",
  contador: "Plan Contador",
};
