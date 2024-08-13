import { BotEvent, MedplumClient } from '@medplum/core';
import { Patient } from '@medplum/fhirtypes';
import { createPrivateKey, randomBytes } from 'crypto';
import { SignJWT } from 'jose';
import fetch from 'node-fetch';

export async function handler(medplum: MedplumClient): Promise<Patient | undefined> {
    //   const privateKeyString = event.secrets['EPIC_PRIVATE_KEY'].valueString;
    //   const clientId = event.secrets['EPIC_CLIENT_ID'].valueString;
    //   if (!privateKeyString || !clientId) {
    //     return undefined;
    //   }

    //   const privateKey = createPrivateKey(privateKeyString);
    console.log("epic start");
    const clientId = "29acf640-9580-4d2b-aa31-46c244e99042";
    const baseUrl = 'https://fhir.epic.com/interconnect-fhir-oauth/';
    const tokenUrl = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';
    const fhirUrlPath = 'api/FHIR/R4/';

    // Construct Epic MedplumClient base
    const epicClient = new MedplumClient({
        fetch,
        baseUrl,
        tokenUrl,
        fhirUrlPath,
        clientId,
    });

    // Construct JWT assertion
    //   const jwt = await new SignJWT({})
    //     .setProtectedHeader({ alg: 'RS384', typ: 'JWT' })
    //     .setIssuer(clientId)
    //     .setSubject(clientId)
    //     .setAudience(tokenUrl)
    //     .setJti(randomBytes(16).toString('hex'))
    //     .setIssuedAt()
    //     .setExpirationTime('5m')
    //     .sign(privateKey);

    const jwt = `eyJhbGciOiJSUzM4NCIsInR5cCI6IkpXVCJ9Cg.eyJpc3MiOiIyOWFjZjY0MC05NTgwLTRkMmItYWEzMS00NmMyNDRlOTkwNDIiLCJzdWIiOiIyOWFjZjY0MC05NTgwLTRkMmItYWEzMS00NmMyNDRlOTkwNDIiLCJhdWQiOiJodHRwczovL2ZoaXIuZXBpYy5jb20vaW50ZXJjb25uZWN0LWZoaXItb2F1dGgvb2F1dGgyL3Rva2VuIiwianRpIjoiZjllYWFmYmEtMmU0OS0xMWVhLTg4ODAtNWNlMGM1YWVlNjc5IiwiZXhwIjoxNTgzNTI0NDAyLCJuYmYiOjE1ODM1MjQxMDIsImlhdCI6MTU4MzUyNDEwMn0K.TgYIFLQ6PFyPpztxMUIt7MvFzAGwT-WgXvZ8qt-Ni_Zq_RR3mLiC2f98lEw-458BDRqDp6izPrQ756SOO_pnQjc7eNPSRBb6mokq1Dxv2PcVd2vAJjkIaCaKQ8pxyci-7pRFRZMt_oftwflVMdm1CjTuf7zZ1xPfHDfCAmr3KVeZPrwy7nxrsPYTg5KH1XcBKK3rVuUUv8p2ptm5LGyikKTT8NNJWCOMhXuwuUH1gbgH2NwZ2cePjUWrOCIcO7eahWVvqtlMma0sc3XRxNJgsGy5ffpIiVgxfDjRk4Ev_SAL2NyjN7WvVscSgbuRVFMsNANTKWc3ixKjZToQvCXqtQ`;

    // Start the JWT assertion login
    // await epicClient.startJwtAssertionLogin(jwt);

    // console.log('Logged in');

    // // Read resource for Camila
    // const camila = await epicClient.readResource('Patient', 'erXuFYUfucBZaryVksYEcMg3');

    // if (!camila) {
    //     throw new Error(`Failed to find any patients`);
    // }

    // // Create resource for Camila in your Local Medplum repository
    // await medplum.createResourceIfNoneExist(camila, 'identifier=erXuFYUfucBZaryVksYEcMg3');

    // return camila;
}