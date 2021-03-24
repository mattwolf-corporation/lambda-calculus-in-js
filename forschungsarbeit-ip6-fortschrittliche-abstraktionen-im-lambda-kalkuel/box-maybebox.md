---
description: Verpacken -> Verarbeiten -> Auspacken
---

# Box

## Beschreibung

Das Box Konstrukt erleichtert das Verarbeiten von beliebigen Werten. Es können beliebige Werte in eine "Box eingepackt" werden und danach gemapped \(weiterverarbeitet\) werden. Dabei ensteht eine Art linearer Datenfluss, der die Leserlichkeit des Codes erhöht. Ausserdem werden keine Variablen Deklarationen für die Zwischenstände benötigt, weil das Resultat der Verarbeitung direkt in die nächste Funktion weitergeleitet wird.

Mit dem Box Konstrukt kann eine Art Pipeline aufgebaut werden, bei dem ein Wert durch diese Pipeline geschickt wird und bei jedem `fmap` wird der Wert weiter prozessiert. Um am Schluss an den verarbeiteten Wert zu kommen wird die letzte Prozessierung nicht mit `fmap` sondern mit `fold` durchgeführt.

### Beispiel Anwendung

#### Code ohne Verwendung von Box

```javascript
const p = {firstName: "Lukas", lastName: "Mueller"};

const addSalutation = fullName => male => (male ? "Mr. " : "Mrs. ") + fullName;

const fullName = p.firstName + " " + p.lastName;
const fullNameUpperCase = fullName.toUpperCase();
const nameWithSalutation = addSalutation(fullNameUpperCase)(true); // Mr. LUKAS MUELLER
```

#### Code mit Verwendung von Box

```javascript
const p = {firstName: "Lukas", lastName: "Mueller"};

const addSalutation = fullName => male => (male ? "Mr. " : "Mrs. ") + fullName;

const nameWithSalutation = Box(p)
                             (fmap)(p => p.firstName + " " + p.lastName)
                             (fmap)(fullName => fullName.toUpperCase())
                             (fold)(fullNameUpperCase => addSalutation(fullNameUpperCase)(true)); // Mr. LUKAS MUELLER
```

## Verwendung

{% hint style="info" %}
In den folgenden Beispielen wird die Box zur besseren Übersicht wie folgt dargestellt:

**`{ content }`**
{% endhint %}

### Box

Die Funktion `Box` wird verwendet um einen beliebigen Wert in eine "Box" zu verpacken. 

{% hint style="info" %}
In anderen Programmiersprachen kann diese Methode verglichen werden mit dem `.of` Konstruktor. Die Funktion ist also eine Art `Box.of()` Methode.
{% endhint %}

```javascript
// Implementation
const fmap  = x => f => g => g(f(x));  

const Box   = x => fmap(x)(id);        // Box.of

// Anwendung
Box(10);                 // { 10 }
Box("Hello World");      // { "Hello World" }
Box(p);                  // { p }
```

### fmap

Die Funktion `fmap` wird verwendet um den Inhalt einer Box zu verarbeiten \(mappen\). Diese `fmap`Funktionsaufrufe können beliebig oft hintereinander angewendet werden \(chainning von Funktionen\). Durch das "chainning" wird eine Art Pipeline aufgebaut.

```javascript
// Implementation
const fmap = x => f => g => g(f(x));

// Anwendung
Box(5)                                 // { 5 }
 (fmap)(n => n * 10)                   // { 50 }
 (fmap)(n => n + 15)                   // { 65 }
 (fmap)(n => String.fromCharCode(n));  // { 'A' }
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
Box(5)                                 // { 5 }
 (fmap)(n => n * 10)                   // { 50 }
 (fmap)(n => n + 15)                   // { 65 }
 (fold)(n => String.fromCharCode(n));  // 'A'
```

### chain _\(flatMap\)_

Die Funktion `chain` wird verwendet um ein _flatMap_ durchzuführen. Wenn eine Map-Funktion eine Box erstellt, würde mit `fmap` eine Box in einer Box entstehen. Um diese extra Box zu entfernen bzw. das gemappte Ergebnis abzuflachen gibt es die Methode `chain`. Dadurch können auch geschachtelte Box Aufrufe stattfinden.

```javascript
// Implementation
const chain = x => f => g => g((f(x)(id)));

// Anwendung
Box(5)                                     // { 5 }
 (fmap)(num => num + 5)                    // { 10 }
 (chain)(num => Box(num * 2)
                 (fmap)(num => num + 1))   // { 21 }
 (chain)(num => Box(num * 3)
                 (fmap)(num => num + 1))   // { 64 }
```

### getContent

Die Funktion `getContent` wird verwendet um den Inhalt einer "Box" zu entpacken.

```javascript
// Implementation
const getContent = b => b(id);

// Anwendung
const p = { firstName: "Tyrion", lastName: "Lannister" };

const box1 = Box(p);

const mapped1 = box1(fmap)(p => p.firstName);

const mapped2 = mapped1(fmap)(firstName => firstName.toUpperCase());

getContent( box1    )   // { firstName: "Tyrion", lastName: "Lannister" } 
getContent( mapped1 )   // "Tyrion"
getContent( mapped2 )   // "TYRION"
```

### app

Die Funktion `app` wird verwendet um eine eingepackte Funktion \(Funktion in einer Box\) auf einen eingepackten Wert anzuwenden. 

{% hint style="info" %}
Dieses "Design Pattern" oder diese `app`-Funktion zusammen mit der Box-Funktion bilden eine [Applikative](https://github.com/madnight/monad-in-pictures-german#applikative).
{% endhint %}

```javascript
// Implementation
const app = x => f => g => g(f(fmap)(x)(id));

// Anwendung
Box(x => x + 5)          // { 10 + 5 }
 (app)( Box(10) );       // { 10 }
 
Box( x => y => x + y)    // { 10 + 24 }
 (app)( Box(10) )        // { 10 }
 (app)( Box(14) );       // { 24 }
```

### liftA2

Die Funktion `liftA2` wird verwendet um eine Funktion auf 2 eingepackte Werte anzuwenden.

```javascript
// Implementation
const liftA2 = f => fx => fy => fx(fmap)(f)(app)(fy);

// Anwendung
liftA2(name1 => name2 => name1 + " " + name2)  // { "Tyrion Lannister" }
 ( Box("Tyrion"   ) )
 ( Box("Lannister") );
```

## Helferfunktion

### debug

Die Funktion `debug` ist eine Helferfunktion, die für debug zwecke da ist. Die Funktion hilft dem Anwender die einzelne Zwischenresultate zu untersuchen in einer Pipeline.

{% hint style="info" %}
Wichtig bei der `debug` Funktion ist, das die Funktion `fold` am Schluss zwingend verwendet werden muss, um das letzte debug Statement auch auszuführen.
{% endhint %}

```javascript
// Implementation
const debug = x => {
    console.log(x);
    return x;
}

// Anwendung
Box(10)
 (fmap)(debug)        // Ausgabe auf der Konsole: 10
 (fmap)(n => n + 2)
 (fold)(debug);       // Ausgabe auf der Konsole: 12
```



## Verwendung der Box mit dem Maybe Type

Um die die Box Konstruktion zu verwenden mit Maybe Werten gibt es spezielle Funktion die das verarbeiten von Maybe Types erleichtert. Somit wird das prozessieren mit dem Maybe Type vereinfacht und die Maybe Types können verknüpft werden. 

{% hint style="info" %}
Wenn irgendwo ein Nothing zurück geliefert wird wird die Funktionskette abgebrochen und die restlichen Funktionen werden nicht ausgeführt.
{% endhint %}

### fmapMaybe

Die Funktion `fmapMaybe` entspricht der Funktion [`fmap`](box-maybebox.md#fmap) für einen [Maybe Type](maybe.md#maybe-type).

```javascript
// Implementation
const fmapMaybe = x => f => g => g(mapMaybe(x)(f));

// Anwendung
 const maybePerson = () => Just( {firstName: "Tyrion", lastName: "Lannister"} );
 
 const maybeFirstName = obj =>
      obj && obj.hasOwnProperty('firstName')
          ? Just(obj.firstName)
          : Nothing;
          
 Box( maybePerson() )                                  // { Just({firstName: "Tyrion", lastName: "Lannister"}) }
  (chainMaybe)( maybeFirstName )                       // { Just("Tyrion") }
  (foldMaybe)( firstName => firstName.toUpperCase() )  //   Just("TYRION")
```

### foldMaybe

Die Funktion `foldMaybe` entspricht der Funktion [`fold`](box-maybebox.md#fold) für einen [Maybe Type](maybe.md#maybe-type)

{% hint style="info" %}
foldMaybe entspricht der Funktion [`mapMaybe`](maybe.md#mapmaybe)\`\`
{% endhint %}

```javascript
// Implementation
const foldMaybe = mapMaybe;

// Anwendung
Box( Just(10) )                   // { Just(10) }
 (fmapMaybe)(x => x + 10)         // { Just(20) }
 (foldMaybe)(num => num + '$')    // Just("20$")
```

### chainMaybe

Die Funktion `chainMaybe` entspricht der Funktion [`chain`](box-maybebox.md#chain-flatmap) für einen [Maybe Type](maybe.md#maybe-type).

{% hint style="info" %}
Die Funktion `chainMaybe` verwendet die Funktion [`flatMapMaybe`](maybe.md#flatmapmaybe)\`\`
{% endhint %}

```javascript
// Implementation
const chainMaybe    = x => f => g => g(flatMapMaybe(x)(f));

// Anwendung
const maybePerson = () => Just({firstName: "Tyrion", lastName: "Lannister"});

const maybeFirstName = obj =>
        obj && obj.hasOwnProperty('firstName')
            ? Just(obj.firstName)
            : Nothing;

Box( maybePerson() )                                  // { Just({firstName: "Tyrion", lastName: "Lannister"}) 
 (chainMaybe)( maybeFirstName )                       // { Just("Tyrion") }
 (foldMaybe)( firstName => firstName.toUpperCase() )  //   Just("TYRION")
```

### appMaybe

Die Funktion `appMaybe` entspricht der Funktion [`app`](box-maybebox.md#app-todo-funktionsname-aendern) für einen Maybe Type.

```javascript
// Implementation
const apMaybe = x => f => g => g(flatMapMaybe(x)(func => mapMaybe(f)(func)));

// Anwendung
Box( Just(x => x + 5) )          // { Just(15 + 5) }
 (appMaybe)( Just(10) );         // { Just(10) }

```

### liftA2Maybe

Die Funktion `liftA2Maybe` entspricht der Funktion [`liftA2`](box-maybebox.md#lifta2) für einen Maybe Type.

{% hint style="info" %}
Falls ein Parameter \(fx, fy oder beide\) Nothing sind, ist das Gesamtergebnis der Funktion Nothing.
{% endhint %}

```javascript
// Implementation
const liftA2Maybe = f => fx => fy =>
    Box(fx)
     (fmapMaybe)(f)
     (appMaybe)(fy);
        
// Anwendung
liftA2Maybe( x => y => x + y)  // (10 + 5)
 ( Just(10) )
 ( Just(5)  );
```

### pureMaybe

Diese Funktion ...



