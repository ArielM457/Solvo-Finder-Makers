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
VITE_API_BASE_URL=http://localhost:8000
```

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
- `POST /outbound/launch`

Lo que muestra:

- Formulario para iniciar outreach
- Nombre
- Empresa
- Rol
- Canal
- Etapa
- Ultima actividad

Cuando haces click en una fila, abre:

- `/conversation/:leadId`

Cuando envias el formulario de outreach:

1. el backend crea el lead
2. genera el primer correo
3. envia el email
4. registra el primer mensaje del agente
5. el lead aparece en el pipeline

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
curl http://localhost:8000/health
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
