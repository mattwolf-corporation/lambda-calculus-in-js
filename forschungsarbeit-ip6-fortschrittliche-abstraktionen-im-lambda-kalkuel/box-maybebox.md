# Box / MaybeBox

## Beschreibung

Das Box Konstrukt erleichtert das Verarbeiten von beliebigen Werten. Es können beliebige Werte in eine "Box eingepackt" werden und danach gemapped \(weiterverarbeitet\) werden. Dabei ensteht eine Art linearer Datenfluss, der die Leserlichkeit des Codes erhöht. Ausserdem werden keine Variablen Deklarationen für die Zwischenstände benötigt, weil das resultat der Verarbeitung direkt in die nächste Funktion weitergeleitet werden.

Mit dem Box Konstrukt kann eine Art Pipeline aufgebaut werden, bei dem ein Wert durch diese Pipeline geschickt wird und bei jedem `mapf` wird der Wert weiter prozessiert. Um am Schluss an den verarbeiteten Wert zu kommen wird die letzte Prozzesierung nicht mit `mapf` sondern mit `fold` durchgeführt.

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



