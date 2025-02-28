<template>
  <q-card flat>
    <q-card-section v-if="suscripcion?.metodoType">
      <div class="row">
        <div class="col-6" v-if="suscripcion?.metodoType === 'transferencia'">
          <div class="text-h6 text-secondary">Método de Pago</div>
          <div>
            <strong>Nombre:</strong> {{ suscripcion?.metodoPago?.nombre }}
          </div>
          <div>
            <strong>Documento de Identidad:</strong>
            {{ suscripcion?.metodoPago?.documentoIdentidad }}
          </div>
          <div>
            <strong>Número de Cuenta:</strong>
            {{ suscripcion?.metodoPago?.nroCuenta }}
          </div>
        </div>
        <div class="col-6" v-if="suscripcion?.metodoType === 'pagoMobil'">
          <div class="text-h6 text-secondary">Método de Pago</div>
          <div>
            <strong>Nombre:</strong> {{ suscripcion?.metodoPago?.nombre }}
          </div>
          <div>
            <strong>Telefono:</strong> {{ suscripcion?.metodoPago?.telefono }}
          </div>
          <div>
            <strong>Documento de Identidad:</strong>
            {{ suscripcion?.metodoPago?.documentoIdentidad }}
          </div>
          <div>
            <strong>Número de Cuenta:</strong>
            {{ suscripcion?.metodoPago?.nroCuenta }}
          </div>
        </div>
        <div class="col-6" v-if="suscripcion?.metodoType === 'zelle'">
          <div class="text-h6 text-secondary">Método de Pago</div>
          <div>
            <strong>Nombre:</strong> {{ suscripcion?.metodoPago?.nombre }}
          </div>
          <div>
            <strong>Email:</strong> {{ suscripcion?.metodoPago?.correo }}
          </div>
        </div>
        <div class="col-6">
          <div class="text-h6 text-secondary">Datos del Pago</div>
          <div><strong>Banco:</strong> {{ suscripcion?.pago?.banco }}</div>
          <div>
            <strong>Fecha de Pago:</strong>
            {{ qDate(suscripcion?.pago?.fechaPago).format("DD-MM-YYYY") }}
          </div>
          <div>
            <strong>Referencia:</strong> {{ suscripcion?.pago?.referencia }}
          </div>
          <div>
            <strong>Pago:</strong>
            {{
              suscripcion?.pago?.monto?.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
            Bs ||
            <strong>Pago en divisas:</strong>
            {{
              suscripcion?.pago?.montoDivisas?.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
            $
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-separator class="q-mb-md" inset color="primary" />
  <q-form ref="empresaForm" class="w-100 q-px-md q-pb-md" no-error-focus>
    <div class="row q-col-gutter-md">
      <div class="col-12 column q-py-xs">
        <p style="font-size: 10px; margin: 0">Razón Social</p>
        <q-input
          v-model="empresaData.razonSocial"
          placeholder="Razón Social"
          dense
          outlined
          color="secondary"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="format_color_text" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 column q-py-xs">
        <p style="font-size: 10px; margin: 0">Suscriptor</p>
        <q-input
          v-model="empresaData.suscriptor"
          placeholder="Suscriptor"
          option-label="nombre"
          dense
          outlined
          color="secondary"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="person" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 column q-py-xs">
        <p style="font-size: 10px; margin: 0">Documento de identidad</p>
        <q-input
          v-model="empresaData.documentoIdentidad"
          class="col-12 col-sm-6"
          placeholder="Documento de Identidad"
          dense
          outlined
          color="secondary"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="badge" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 column q-py-xs">
        <p style="font-size: 10px; margin: 0">Representante legal</p>
        <q-input
          v-model="empresaData.nombreRepresentante"
          dense
          outlined
          color="secondary"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="person" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 column q-py-xs">
        <p style="font-size: 10px; margin: 0">
          Documento de identidad representante
        </p>
        <q-input
          v-model="empresaData.documentoIdentidadRepresentante"
          class="col-12 col-sm-6"
          placeholder="Documento de Identidad"
          dense
          outlined
          color="secondary"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="badge" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 column q-py-xs">
        <p style="font-size: 10px; margin: 0">Dirección</p>
        <q-input
          v-model="empresaData.direccion"
          class="col-12 col-sm-6"
          dense
          outlined
          color="secondary"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="room" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-5 col-md-6 column q-py-xs">
        <p style="font-size: 10px; margin: 0">Sub dominio</p>
        <q-input
          v-model="empresaData.subdominio"
          class="col-12 col-sm-5 col-md-6"
          placeholder="Dominio"
          dense
          outlined
          suffix=".aibiz.com"
          color="secondary"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="language" color="secondary" />
          </template>
        </q-input>
      </div>
      <div class="row col-12 q-py-none" v-if="suscripcion.tipo !== 'cambio'">
        <div class="col-5 column q-py-xs">
          <p style="font-size: 10px; margin: 0">Plan</p>
          <q-input
            v-model="empresaData.plan"
            class="col-5 q-pr-sm"
            placeholder="Planes"
            dense
            outlined
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="description" color="secondary" />
            </template>
          </q-input>
        </div>
        <div class="col-1 column q-px-none q-py-xs">
          <p style="font-size: 10px; margin: 0">Cant. Planes</p>
          <q-input
            v-model="empresaData.cantidad"
            type="number"
            min="1"
            outlined
            dense
            style="width: 60px"
            readonly
          ></q-input>
        </div>
        <div class="col-1 column q-pa-none q-py-xs">
          <p style="font-size: 10px; margin: 0">Cant. Años</p>
          <q-input
            v-model="empresaData.years"
            type="number"
            min="1"
            outlined
            dense
            style="width: 60px"
            readonly
          ></q-input>
        </div>
        <div class="col-5 column q-px-none q-py-xs">
          <p style="font-size: 10px; margin: 0">Fecha de Vencimiento</p>
          <q-input
            v-model="empresaData.newFechaVencimiento"
            dense
            outlined
            color="secondary"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="event" color="secondary" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row col-12 q-py-none" v-else>
        <div class="col-5 column q-py-xs">
          <p style="font-size: 10px; margin: 0">Plan Anterior</p>
          <q-input
            v-model="empresaData.planAnterior"
            class="col-5 q-pr-sm"
            placeholder="Planes"
            dense
            outlined
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="description" color="secondary" />
            </template>
          </q-input>
        </div>
        <div class="col-1 column q-px-none q-py-xs">
          <p style="font-size: 10px; margin: 0">Cant. Ant</p>
          <q-input
            v-model="empresaData.cantidadAnterior"
            type="number"
            min="1"
            outlined
            dense
            style="width: 60px"
            readonly
          ></q-input>
        </div>
        <div class="col-5 column q-py-xs">
          <p style="font-size: 10px; margin: 0">Plan</p>
          <q-input
            v-model="empresaData.plan"
            class="col-5 q-pr-sm"
            placeholder="Planes"
            dense
            outlined
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="description" color="secondary" />
            </template>
          </q-input>
        </div>
        <div class="col-1 column q-px-none q-py-xs">
          <p style="font-size: 10px; margin: 0">Cant. Planes</p>
          <q-input
            v-model="empresaData.cantidad"
            type="number"
            min="1"
            outlined
            dense
            style="width: 60px"
            readonly
          ></q-input>
        </div>
      </div>
    </div>
    <div
      class="col-12 flex justify-between"
      v-if="
        suscripcion?.estado === 'Pendiente' &&
        suscripcion?.tipo === 'suscripcion'
      "
    >
      <q-btn
        :loading="laoderRechazar"
        unelevated
        color="negative"
        class="q-mt-md text-capitalize"
        @click="rechazarSolicitud"
        >Rechazar
      </q-btn>
      <q-btn
        @click="avisoActivacion = true"
        unelevated
        color="secondary"
        class="q-mt-md text-capitalize"
        >Aprobar
      </q-btn>
    </div>
    <div
      class="col-12 flex justify-between"
      v-if="
        suscripcion?.estado === 'Pendiente' &&
        suscripcion?.tipo !== 'suscripcion'
      "
    >
      <q-btn
        :loading="laoderRechazar"
        unelevated
        color="negative"
        class="q-mt-md text-capitalize"
        @click="rechazarSolicitud"
        >Rechazar
      </q-btn>
      <q-btn
        :loading="loaderCreate"
        @click="activarSuscripcion"
        unelevated
        color="secondary"
        class="q-mt-md text-capitalize"
        >Aprobar
      </q-btn>
    </div>
  </q-form>
  <q-dialog
    v-model="avisoActivacion"
    @keydown.esc.stop="avisoActivacion = false"
    persistent
  >
    <q-card style="width: 600px; max-width: 80vw">
      <!-- Botón de cierre (X) -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Confirmación</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="avisoActivacion = false" />
      </q-card-section>
      <q-separator color="black" inset />

      <!-- Contenido del diálogo -->
      <q-card-section>
        <div>
          <p>
            <strong>¿Está seguro de que desea aprobar esta solicitud?</strong>
          </p>
          <p>
            Una vez aprobada, el proceso puede tardar unos minutos en
            completarse. Durante este tiempo, le pedimos no cierre esta ventana
            ni realice otras acciones hasta que el proceso haya finalizado.
          </p>
        </div>
      </q-card-section>

      <!-- Acción de confirmación -->
      <q-card-actions align="right">
        <q-btn
          label="Confirmar"
          color="secondary"
          @click="activarSuscripcion"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { momentDateFull, qDate } from "src/utils/qDate";
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
import { tiposPlanes } from "src/constants/magicString";
const props = defineProps({
  suscripcionData: {
    required: true,
  },
  loaderAction: {
    default: false,
    type: Boolean,
  },
});
const emit = defineEmits(["activar-suscripcion", "rechazar-solicitud"]);
const suscripcion = ref({});
const empresaForm = ref(null);
const empresaData = ref({});
const loaderCreate = ref(false);
const laoderRechazar = ref(false);
const avisoActivacion = ref(false);

onMounted(() => {
  suscripcion.value = props.suscripcionData;
  empresaData.value = {
    razonSocial:
      props.suscripcionData?.dataSubDominio?.razonSocial ||
      props.suscripcionData?.empresa?.nombre,
    suscriptor: props.suscripcionData?.suscriptor?.nombre,
    telefono: props.suscripcionData?.empresa?.telefono,
    tipoDocumento:
      props.suscripcionData?.dataSubDominio?.tipoDocumento ||
      props.suscripcionData?.empresa?.tipoDocumento,
    documentoIdentidad:
      props.suscripcionData?.dataSubDominio?.tipoDocumento +
        props.suscripcionData?.dataSubDominio?.documentoIdentidad ||
      props.suscripcionData?.empresa?.tipoDocumento +
        props.suscripcionData?.empresa?.documentoIdentidad,
    subdominio: props.suscripcionData?.subdominio,
    plan: `${props.suscripcionData?.plan?.nombre} (${
      tiposPlanes[props.suscripcionData?.plan?.tipo]
    })`,
    planAnterior: props.suscripcionData?.planAnterior?.nombre
      ? `${props.suscripcionData?.planAnterior?.nombre} (${
          tiposPlanes[props.suscripcionData?.planAnterior?.tipo]
        })`
      : "",
    cantidad:
      props.suscripcionData?.cantidad ||
      props.suscripcionData?.dataSubDominio?.cantPlanes,
    cantidadAnterior: props.suscripcionData?.cantidadAnterior,
    meses: props.suscripcionData?.meses,
    years: props.suscripcionData?.years,
    nombreRepresentante:
      props.suscripcionData?.dataSubDominio?.nombreRepresentante ||
      props.suscripcionData?.empresa?.nombreRepresentante,
    documentoIdentidadRepresentante:
      props.suscripcionData?.dataSubDominio?.tipoDocumentoRepresentante +
        props.suscripcionData?.dataSubDominio
          ?.documentoIdentidadRepresentante ||
      props.suscripcionData?.empresa?.tipoDocumentoRepresentante +
        props.suscripcionData?.empresa?.documentoIdentidadRepresentante,
    direccion:
      props.suscripcionData?.dataSubDominio?.direccion ||
      props.suscripcionData?.empresa?.direccion,
    /*newFechaVencimiento: qDate()
      .add(props.suscripcionData?.meses, "month")
      .format("DD-MM-YYYY"),*/
  };
  if (!props.suscripcionData?.dataSubDominio?.fechaVencimiento)
    empresaData.value.newFechaVencimiento = qDate()
      .add(props.suscripcionData?.meses, "month")
      .format("YYYY-MM-DD");
  else if (
    momentDateFull(props.suscripcionData?.dataSubDominio?.fechaVencimiento)
      .endOf("day")
      .isSameOrBefore(momentDateFull())
  ) {
    console.log("fecha vencida");
    empresaData.value.newFechaVencimiento = momentDateFull()
      .add(props.suscripcionData?.meses, "month")
      .format("YYYY-MM-DD");
    suscripcion.value.newFechaVencimiento =
      empresaData.value.newFechaVencimiento;
  } else {
    console.log("fecha no vencida");
    empresaData.value.newFechaVencimiento = momentDateFull(
      props.suscripcionData?.dataSubDominio?.fechaVencimiento,
    )
      .endOf("day")
      .add(props.suscripcionData?.meses, "month")
      .format("YYYY-MM-DD");
  }
  suscripcion.value.newFechaVencimiento = momentDateFull(
    props.suscripcionData?.dataSubDominio?.fechaVencimiento,
  )
    .endOf("day")
    .add(props.suscripcionData?.meses, "month");
});
function activarSuscripcion() {
  loaderCreate.value = true;
  emit("activar-suscripcion", suscripcion.value);
}
function rechazarSolicitud() {
  laoderRechazar.value = true;
  emit("rechazar-solicitud", suscripcion.value);
}
watch(
  () => props.loaderAction,
  (value) => {
    if (value) {
      loaderCreate.value = false;
      laoderRechazar.value = false;
    }
  },
);
</script>
