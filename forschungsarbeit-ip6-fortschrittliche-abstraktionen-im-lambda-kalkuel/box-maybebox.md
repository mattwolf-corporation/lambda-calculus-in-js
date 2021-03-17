---
description: 'Wert -> Einpacken -> [Verarbeiten] -> Auspacken -> Resultat'
---

# Box / MaybeBox

## Beschreibung

Das Box Konstrukt erleichtert das Verarbeiten von beliebigen Werten. Es können beliebige Werte in eine "Box eingepackt" werden und danach gemapped \(weiterverarbeitet\) werden. Dabei ensteht eine Art linearer Datenfluss, der die Leserlichkeit des Codes erhöht. Ausserdem werden keine Variablen Deklarationen für die Zwischenstände benötigt, weil das Resultat der Verarbeitung direkt in die nächste Funktion weitergeleitet wird.

Mit dem Box Konstrukt kann eine Art Pipeline aufgebaut werden, bei dem ein Wert durch diese Pipeline geschickt wird und bei jedem `mapf` wird der Wert weiter prozessiert. Um am Schluss an den verarbeiteten Wert zu kommen wird die letzte Prozessierung nicht mit `mapf` sondern mit `fold` durchgeführt.

### Beispiel Anwendung

Code ohne Verwendung von Box

```javascript
const p = {firstName: "Lukas", lastName: "Mueller"};

const addSalutation = fullName => male => (male ? "Mr. " : "Mrs. ") + fullName;

const fullName = p.firstName + " " + p.lastName;
const fullNameUpperCase = fullName.toUpperCase();
const nameWithSalutation = addSalutation(fullNameUpperCase)(true); // Mr. LUKAS MUELLER
```

Code mit Verwendung von Box

```javascript
const p = {firstName: "Lukas", lastName: "Mueller"};

const addSalutation = fullName => male => (male ? "Mr. " : "Mrs. ") + fullName;

const nameWithSalutation = Box(p)
                             (mapf)(p => p.firstName + " " + p.lastName)
                             (mapf)(fullName => fullName.toUpperCase())
                             (fold)(fullNameUpperCase => addSalutation(fullNameUpperCase)(true)); // Mr. LUKAS MUELLER
```

## Verwendung

{% hint style="info" %}
In den folgenden Beispielen wird die Box zur besseren Übersicht wie folgt dargestellt:

`{ content }`
{% endhint %}

### Box

Die Funktion `Box` wird verwendet um einen beliebigen Wert in eine "Box" zu verpacken. 

{% hint style="info" %}
In anderen Programmiersprachen kann diese Methode verglichen werden mit dem `.of` Konstruktor. Die Funktion ist also eine Art `Box.of()` Methode.
{% endhint %}

```javascript
// Implementation
const mapf  = x => f => g => g(f(x));  

const Box   = x => mapf(x)(id);                     // Box.of

// Anwendung
Box(10);                 // { 10 }
Box("Hello World");      // { "Hello World" }
Box(p);                  // { p }
```

### mapf

Die Funktion `mapf` wird verwendet um den Inhalt einer Box zu verarbeiten \(mappen\). Diese mapf Funktionsaufrufe können beliebig oft hinteinander angewendet werden \(chainning von Funktionen\). Durch das "chainning" wird eine Art Pipeline aufgebaut.

```javascript
// Implementation
const mapf  = x => f => g => g(f(x));

// Anwendung
const boxWithNumber = Box(5);                 // { 5 }

boxWithNumber
        (mapf)(n => n * 10)                   // { 50 }
        (mapf)(n => n + 15)                   // { 65 }
        (mapf)(n => String.fromCharCode(n));  // { 'A' }
```

### fold

Die Funktion `fold` wird verwendet um einen Wert in der "Box" zu mappen und anschliessend zu extrahieren \(den Inhalt aus der Box auspacken\).

{% hint style="info" %}
Diese Funktion wird meistens am Schluss in einer Box Pipeline verwendet, um den Wert nach dem letzten Verarbeitungsschritt zu entpacken.
{% endhint %}

```javascript
// Implementation
const fold  = x => f => f(x);

// Anwendung
const boxWithNumber = Box(5);                 // { 5 }

boxWithNumber
        (mapf)(n => n * 10)                   // { 50 }
        (mapf)(n => n + 15)                   // { 65 }
        (fold)(n => String.fromCharCode(n));  // 'A'
```

### chain \(flatMap\)

Die Funktion `chain` wird verwendet um ein flatMap durchzuführen. Wenn eine Map-Funktion eine Box erstellt, würde mit `mapf` eine Box in einer Box entstehen. Um diese extra Box zu entfernen bzw. das gemappte Ergebnis abzuflachen gibt es die Methode chain. Dadurch können auch geschachtelte Box Aufrufe stattfinden.

```javascript
// Implementation
const chain = x => f => g => g((f(x)(id)));

// Anwendung
const box1 = Box(5)                                         // { 5 }
                (mapf)(num => num + 5)                      // { 10 }                  
                (chain)(num => Box(num * 2)
                                    (mapf)(num => num + 1)) // { 21 }
                (chain)(num => Box(num * 3)
                                    (mapf)(num => num + 1)) // { 64 }
```

### getContent

Die Funktion `getContent` wird verwendet um den Inhalt einer "Box" zu entpacken.

```javascript
// Implementation
const getContent = b => b(id);

// Anwendung
const p = { firstName: "Tyrion", lastName: "Lannister" };

const box1 = Box(p);

const mapped1 = box1(mapf)(p => p.firstName);

const mapped2 = mapped1(mapf)(firstName => firstName.toUpperCase());

getContent(box1);     // { firstName: "Tyrion", lastName: "Lannister" } 
getContent(mapped1)   // "Tyrion"
getContent(mapped2)   // "TYRION"
```

### app

Die Funktion `app` wird verwendet um



```javascript
const apply = x => f => g => g(f(mapf)(x)(id));     // Box Applicative


```

### liftA2

Die Funktion `liftA2` wird 

```javascript
const liftA2 = f => fx => fy =>
        fx(mapf)(f)(apply)(fy)
```

### debug

Die Funktion `debug` wird verwendet

```javascript
const debug = x => {
    console.log(x);
    return x;
}
```

