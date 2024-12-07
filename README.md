# `@forsakringskassan/docs-live-example`

`live-example` är en Vue-komponent som används för att presentera ett levande exempel samt tillhörande markup för att reproducera exemplet.

Komponenten består av tre ytor:

- exempelyta: innehåller det kompilerade exemplet.
- kontrollyta: innehåller de inmatningsfält som används för att konfigurera exemplet.
- kodyta: visar HTML-markup och Vue-template för exemplet (om Vue-komponenter används).

Eftersom `live-example` kompileras i runtime så kan man direkt modifiera exemplet och den markup som visas genom att använda de inmatningsfält som lagts till i kontrollytan.

## Användning

Installera paketet genom att köra:

`npm install --save-dev @forsakringskassan/docs-live-example`

Om du använder `html-validate` bör du även uppdatera din `.htmlvalidate.json` med följande rader för att registrera `live-example` elementet:

```json
"extends": [
    "@forsakringskassan/docs-live-example/htmlvalidate:recommended",
],
"plugins": [
    "@forsakringskassan/docs-live-example/htmlvalidate"
],
```

### Props

#### `template`

För att generera ett exempel så används `template` för att skicka in markup.

#### `components` (optional)

De Vue-komponenter som används i markup som skickas in till `template` måste läggas till i `components`.

#### `livedata` (optional)

Om exemplet behöver spara ett värde (till exempel `v-model`) så skickas detta in genom `livedata`.

#### `livemethods` (optional)

Om exemplet behöver köra en metod så skickas detta in genom `livemethods`.

### Konfigurera exemplet

För att skapa ett konfigurerbart exempel börjar vi med att skapa en ny komponent `AwesomeComponentLiveExample.vue`.
Vi rekommenderar att använda `LiveExample` som suffix på alla live-exempel.

Följande boilerplate kan användas:

```vue static
<template>
    <live-example :components :template :livedata>
        <!-- Example configuration -->
    </live-example>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LiveExample } from "@forsakringskassan/docs-live-example";

export default defineComponent({
    name: "AwesomeComponentLiveExample",
    components: { LiveExample },
    data() {
        return {};
    },
    computed: {
        livedata(): unknown {
            return {
                /* data used by generated code */
            };
        },
        components(): unknown {
            return {
                /* components used by generated code */
            };
        },
        template(): string {
            return /* HTML */ ` <div>Hello World!</div> `;
        },
    },
});
</script>
```

För att skapa en inställning lägger vi först in komponenter:

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

```diff
     data() {
-        return {};
+        return {
+            tagName: "div",
+            placeholderText: false,
+        };
     },
```

Därefter kan vi modifiera `template` att nyttja inställningar:

```diff
         template(): string {
-            return /* HTML */ ` <div>Hello World!</div> `;
+            const { tagName, placeholderText } = this;
+            const message = placeholderText ? "Lorem ipsum dolor sit amet" : "Hello World!" ;
+            return /* HTML */ ` <${tagName}>${message}</${tagName}> `;
         },
```

Det går också med fördel att använda `createElement` (se beskrivning längre ner):

```diff
         template(): string {
-            return /* HTML */ ` <div>Hello World!</div> `;
+            const { tagName, placeholderText } = this;
+            const message = placeholderText ? "Lorem ipsum dolor sit amet" : "Hello World!" ;
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

A helper function to render the markup for the live example.

```ts
createElement(tagName);
createElement(tagName, content);
createElement(tagName, attributes);
createElement(tagName, attributes, content);
```

Create markup for a simple element:

```ts
createElement("div");
// <div>
```

Adding attributes:

```ts
createElement("div", { id: "my-awesome-id", class: ["foo", "bar"] });
// <div id="my-awesome-id" class="foo bar">
```

Attributes can be:

- `string` - value is passed as-is: `{ key: "value" }` becomes `key="value"`.
- `number` - value is converted to string: `{ key: 12 }` becomes `key="12"`.
- `boolean` - key is set if value is true: `{ key: true }` becomes `key` and `{ key: false }` omits the attribute.
- `Array` - each non-empty item is joined: `{ key: ["foo", "bar"] }` becomes `key="foo bar"`.
- `Object` - nests attributes: `{ data: { key: "value" } }` becomes `data-key="value"`.
- `null` and `undefined` are omitted from its context, e.g. `{ key: null }` `{ key: [null] ` and `{ key: { value: null } }` are all omitted.

Content can be added:

```ts
createElement("div", "lorem ipsum");
// <div> lorem ipsum </div>

createElement("div", [
    createElement("h1", "My Awesome Heading"),
    createElement("p", ["Lorem ipsum", "dolor sit amet"]),
]);
// <div> <h1> My Awesome Heading </h1> <p> Lorem ipsum dolor sit amet </p> </div>
```

Combined:

```ts
createElement("div", { id: "foo" }, "lorem ipsum");
// <div id="foo"> lorem ipsum </div>
```
