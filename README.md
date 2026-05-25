# ZolvoReach Frontend

Dashboard React para visualizar el estado del sistema de ventas automatizado de ZolvoReach.

## Que hace este frontend

Este proyecto muestra tres vistas principales:

1. `Pipeline`
   Muestra todos los leads, su etapa, canal y ultima actividad, y ahora permite lanzar outreach nuevo desde la UI.

2. `Conversation`
   Muestra el detalle de una conversacion de un lead, sus mensajes y el resumen generado por IA cuando la conversacion se cierra.

3. `Metrics`
   Muestra KPIs, embudo de conversion y reuniones recientes.

El frontend no habla directamente con n8n.
El frontend habla con el backend FastAPI.
El backend lee y escribe en Supabase.
n8n dispara webhooks hacia el backend.
El primer outreach tambien puede empezar desde el frontend.

## Flujo simple

1. n8n manda un webhook al backend.
2. El backend procesa el evento.
3. El backend guarda o actualiza datos en Supabase.
4. El frontend consulta al backend.
5. El dashboard muestra los cambios.

## Variable de entorno

Crear un archivo `.env` en `ZF-client/` con esto:

```env
VITE_API_BASE_URL=https://zolvo-agent.thankfulisland-7e6d96dc.westus.azurecontainerapps.io
VITE_N8N_NEW_LEAD_WEBHOOK=https://jafel-ai.app.n8n.cloud/webhook-test/new-lead
```

Si el workflow de n8n ya esta activado de forma publica, cambia `webhook-test` por `webhook`.

## Como levantar el frontend

```powershell
cd F:\Proyectos\Agentes-Captacion-clientes-Makers\ZF-client
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

## Pantallas

### Pipeline

Consume:

- `GET /leads`

Lo que muestra:

- Nombre
- Empresa
- Rol
- Canal
- Etapa
- Ultima actividad

Cuando haces click en una fila, abre:

- `/conversation/:leadId`

### Create Lead

Consume:

- `POST VITE_N8N_NEW_LEAD_WEBHOOK`

Lo que hace:

1. envia el formulario al webhook de n8n
2. n8n reenvia el lead al backend
3. el backend crea el lead
4. genera el correo por defecto
5. envia el email inicial
6. el lead aparece en el pipeline

### Conversation

Consume:

- `GET /leads/{leadId}`
- `GET /conversations/{leadId}`

Lo que muestra:

- Datos del lead
- Mensajes de la conversacion
- Estado de la conversacion
- Resumen IA si la conversacion fue cerrada
- Indicador de meeting booked si existe una reunion

### Metrics

Consume:

- `GET /metrics/dashboard`

Lo que muestra:

- Total leads
- Reply rate
- Meetings booked
- Embudo de conversion
- Reuniones recientes

## Como probar que el frontend funciona

### Prueba 1

Verifica que el backend este arriba:

```powershell
curl https://zolvo-agent.thankfulisland-7e6d96dc.westus.azurecontainerapps.io/health
```

Si responde `status: ok`, el frontend ya puede conectarse.

### Prueba 2

Abre el frontend en `http://localhost:5173`.

Debes poder:

- ver la tabla del pipeline
- entrar a una conversacion al hacer click en un lead
- abrir metrics y ver KPIs

### Prueba 3

Si no ves datos:

- revisa que el backend tenga datos en Supabase
- revisa que `VITE_API_BASE_URL` apunte bien al backend
- revisa la consola del navegador

## Como saber si esta conectado

Si todo esta conectado:

- `Pipeline` carga leads reales
- `Conversation` carga mensajes reales
- `Metrics` carga metricas reales

Si no esta conectado:

- veras mensajes de advertencia por falta de `VITE_API_BASE_URL`
- o errores del backend en pantalla

## Build de produccion

```powershell
npm run build
```

## Resumen rapido

El frontend no crea la logica de negocio.
Solo muestra lo que el backend expone por API.
Por eso, para probar el sistema completo, primero debe estar vivo el backend.
