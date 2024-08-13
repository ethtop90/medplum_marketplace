import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { MedplumClient } from '@medplum/core';
import { MedplumProvider } from '@medplum/react';
import '@medplum/react/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

// const medplum = new MedplumClient({
//   onUnauthenticated: () => (window.location.href = '/'),
//   // baseUrl: 'http://localhost:8103/', //Uncomment this to run against the server on your localhost; also change `googleClientId` in `./pages/SignInPage.tsx`
// });

console.log("epic start");
const clientId = "29acf640-9580-4d2b-aa31-46c244e99042";
const baseUrl = 'https://fhir.epic.com/interconnect-fhir-oauth/';
const tokenUrl = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';
const fhirUrlPath = 'api/FHIR/R4/';

// Construct Epic MedplumClient base
const medplum = new MedplumClient({
    fetch,
    baseUrl,
    tokenUrl,
    fhirUrlPath,
    clientId,
});

const theme = createTheme({
  headings: {
    sizes: {
      h1: {
        fontSize: '1.125rem',
        fontWeight: '500',
        lineHeight: '2.0',
      },
    },
  },
  fontSizes: {
    xs: '0.6875rem',
    sm: '0.875rem',
    md: '0.875rem',
    lg: '1.0rem',
    xl: '1.125rem',
  },
});

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <StrictMode>
    <BrowserRouter>
      <MedplumProvider medplum={medplum}>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </MedplumProvider>
    </BrowserRouter>
  </StrictMode>
);
