# `@forsakringskassan/docs-live-example`

`@forsakringskassan/docs-live-example` innehåller `live-example`, en Vue-komponent
som används för att presentera ett levande, interaktivt exempel tillsammans med
den markup som krävs för att reproducera det. Paketet är avsett för dig som
skriver komponentdokumentation och vill låta läsaren experimentera med ett
exempel direkt i dokumentationen, istället för att bara visa en statisk
kodsnutt.

Komponenten består av tre ytor:

- **exempelyta**: innehåller det kompilerade exemplet.
- **kontrollyta**: innehåller de inmatningsfält som används för att konfigurera exemplet.
- **kodyta**: visar HTML-markup och Vue-template för exemplet (om Vue-komponenter används).

Eftersom `live-example` kompileras i runtime går det att direkt modifiera
exemplet och den markup som visas genom att använda de inmatningsfält som
lagts till i kontrollytan.

## Kom igång

1. Installera paketet som en utvecklingsberoende:

    ```sh
    npm install --save-dev @forsakringskassan/docs-live-example
    ```

2. Importera `LiveExample` och lägg till den i din komponent:

    ```ts
    import { LiveExample } from "@forsakringskassan/docs-live-example";
    ```

3. Rendera komponenten med minst en `template`:

    ```html
    <live-example template="<div>Hello World!</div>" />
    ```

Fortsätt läsa nedan för hur du bygger ett komplett, konfigurerbart exempel och
hur du kopplar in `html-validate`.

### Importera från paketet

Paketet exporterar två saker:

```ts
import {
    LiveExample,
    createElement,
} from "@forsakringskassan/docs-live-example";
```

- `LiveExample` — Vue-komponenten som renderar exempel-, kontroll- och kodytan.
- `createElement` — en hjälpfunktion för att bygga upp markup som skickas till `template` (se [`createElement`](#createelement) nedan).

Stilmallen för komponenten importeras separat:

```ts
import "@forsakringskassan/docs-live-example/dist/main.css";
```

### `html-validate`

Om du använder `html-validate` för att validera dokumentationens markup bör du
registrera `live-example`-elementet genom att lägga till följande i din
`.htmlvalidate.json`:

```json
{
    "extends": [
        "@forsakringskassan/docs-live-example/htmlvalidate:recommended"
    ],
    "plugins": ["@forsakringskassan/docs-live-example/htmlvalidate"]
}
```

`html-validate` är en valfri (peer) dependency — konfigurationen ovan behövs
bara om ditt projekt redan använder `html-validate`.

## Props

| Prop                | Typ                         | Krävs | Standardvärde | Beskrivning                                                                               |
| ------------------- | --------------------------- | :---: | ------------- | ----------------------------------------------------------------------------------------- |
| `template`          | `string`                    |  Ja   | —             | Markup (HTML eller Vue-template) som renderas i exempelytan.                              |
| `components`        | `object`                    |  Nej  | `{}`          | Vue-komponenter som används i `template` och som ska registreras lokalt för exemplet.     |
| `livedata`          | `object`                    |  Nej  | `{}`          | Data som exemplet behöver komma åt och kunna uppdatera, till exempel för `v-model`.       |
| `livemethods`       | `object`                    |  Nej  | `{}`          | Metoder som exemplet behöver kunna anropa.                                                |
| `forceSingleColumn` | `boolean`                   |  Nej  | `false`       | Forcerar exemplet att visas i en kolumn, användbart när kontrollytan hindrar exempelytan. |
| `language`          | `"vue" \| "html" \| "auto"` |  Nej  | `"auto"`      | Anger hur `template` ska tolkas. Lämna som `"auto"` om du inte har ett specifikt behov.   |

## Konfigurera exemplet

För att skapa ett konfigurerbart exempel, skapa en ny komponent
`AwesomeComponentLiveExample.vue`. Vi rekommenderar att använda `LiveExample`
som suffix på alla live-exempel.

Följande boilerplate kan användas som utgångspunkt:

```vue static
<template>
    <live-example :components :template :livedata />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";

export default defineComponent({
    name: "AwesomeComponentLiveExample",
    components: { LiveExample },
    computed: {
        components(): unknown {
            return {/* components used by generated code */};
        },
        livedata(): unknown {
            return {/* data used by generated code */};
        },
        template(): string {
            return /* HTML */ `<div>Hello World!</div>`;
        },
    },
});
</script>
```

Lägg sedan till de inmatningsfält som ska styra exemplet i kontrollytan:

```diff
     <live-example :components :template :livedata>
+        <f-select-field v-model="tagName">
+            <template #label> Element </template>
+            <option value="div"> div </option>
+            <option value="p"> p </option>
+            <option value="em"> em </option>
+        </f-select-field>
+        <f-checkbox-field v-model="placeholderText" :value="true">
+            Use placeholder text
+        </f-checkbox-field>
     </live-example>
```

Lägg till motsvarande data:

```diff
+    data() {
+        return {
+            tagName: "div",
+            placeholderText: false,
+        };
+    },
     computed: {
```

Och låt `template` använda värdena:

```diff
         template(): string {
-            return /* HTML */ `<div>Hello World!</div>`;
+            const { tagName, placeholderText } = this;
+            const message = placeholderText
+                ? "Lorem ipsum dolor sit amet"
+                : "Hello World!";
+            return /* HTML */ `<${tagName}>${message}</${tagName}>`;
         },
```

Det går också med fördel att bygga upp markupen med `createElement` istället
för strängmallar (se [`createElement`](#createelement) nedan):

```diff
         template(): string {
-            return /* HTML */ `<div>Hello World!</div>`;
+            const { tagName, placeholderText } = this;
+            const message = placeholderText
+                ? "Lorem ipsum dolor sit amet"
+                : "Hello World!";
+            return createElement(tagName, message);
         },
```

Resultatet:

```vue live-example
<template>
    <live-example :template>
        <div>
            <label for="config-element"> Element </label>
            <select id="config-element" v-model="tagName">
                <option value="div">div</option>
                <option value="p">p</option>
                <option value="em">em</option>
            </select>
        </div>
        <div>
            <label>
                <input
                    type="checkbox"
                    v-model="placeholderText"
                    :value="true"
                />
                Use placeholder text
            </label>
        </div>
    </live-example>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    LiveExample,
    createElement,
} from "@forsakringskassan/docs-live-example";

export default defineComponent({
    name: "AwesomeComponentLiveExample",
    components: { LiveExample },
    data() {
        return {
            tagName: "div",
            placeholderText: false,
        };
    },
    computed: {
        template(): string {
            const { tagName, placeholderText } = this;
            const message = placeholderText
                ? "Lorem ipsum dolor sit amet"
                : "Hello World!";
            return createElement(tagName, message);
        },
    },
});
</script>
```

## `createElement`

En hjälpfunktion för att bygga upp markupen för ett exempel utan att behöva
skriva HTML-strängar för hand. Funktionen returnerar en färdig HTML-sträng som
kan användas direkt som `template`.

```ts
createElement(tagName);
createElement(tagName, content);
createElement(tagName, attributes);
createElement(tagName, attributes, content);
```

Skapa markup för ett enkelt element:

```ts
createElement("div");
// <div>
```

Lägg till attribut:

```ts
createElement("div", { id: "my-awesome-id", class: ["foo", "bar"] });
// <div id="my-awesome-id" class="foo bar">
```

Attribut kan vara av följande typer:

- `string` — värdet skrivs ut som det är: `{ key: "value" }` blir `key="value"`.
- `number` — värdet konverteras till en sträng: `{ key: 12 }` blir `key="12"`.
- `boolean` — nyckeln sätts om värdet är `true`: `{ key: true }` blir `key`, `{ key: false }` utelämnar attributet helt.
- `Array` — varje icke-tomt värde slås ihop med mellanslag: `{ key: ["foo", "bar"] }` blir `key="foo bar"`.
- `Object` — nästlade attribut byggs ihop med bindestreck: `{ data: { key: "value" } }` blir `data-key="value"`.
- `null` och `undefined` utelämnas alltid, oavsett var i strukturen de förekommer, t.ex. `{ key: null }`, `{ key: [null] }` och `{ key: { value: null } }` resulterar alla i att attributet/värdet hoppas över.

Lägg till innehåll:

```ts
createElement("div", "lorem ipsum");
// <div> lorem ipsum </div>

createElement("div", [
    createElement("h1", "My Awesome Heading"),
    createElement("p", ["Lorem ipsum", "dolor sit amet"]),
]);
// <div> <h1> My Awesome Heading </h1> <p> Lorem ipsum dolor sit amet </p> </div>
```

Kombinerat, attribut och innehåll samtidigt:

```ts
createElement("div", { id: "foo" }, "lorem ipsum");
// <div id="foo"> lorem ipsum </div>
```
