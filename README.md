# Utuni

## Programmering i TypeScript, projektuppgift

I detta projekt skulle vi bygga en dynamisk webbapplikation med Angular II som ramverk. På webbplatsen ska man kunna se kurser hämtade från ett API, sortera dessa enligt bokstavs- eller storleksordning, filtrera enligt ämne och söka efter kurser.

Vidare ska man också kunna lägga till kurser i ett personligt ramschema genom localStorage.

### Uppbyggnad

Hela webbplatsen är byggd i Angular version 18 och använder sig därför av standalone components. Dependencies kan importeras direkt i komponenten utan att behöva importeras i en `app.module.ts`-fil eller deklareras i NgModule. Faktum är att den filen saknas helt.

För pagineringen har Angular Materials används. Utöver detta har inga bibliotek nyttjats förutom de inbyggda i Angular. Materials användes då i courses-komponenten enbart.
