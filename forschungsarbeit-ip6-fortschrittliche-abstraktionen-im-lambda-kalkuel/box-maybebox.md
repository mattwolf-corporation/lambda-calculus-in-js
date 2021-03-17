# Box / MaybeBox

## Beschreibung

Das Box Konstrukt erleichtert das Mapping von beliebigen Werten. Mit dem Box Konstrukt können beliebige Werte "eingepackt" werden und danach gemapped werden. Dabei ensteht eine Art linearer Datenfluss, somit wird die leserlichkeit des Codes erhöht. Ausserdem werden weniger Variablen Deklarationen benötigt, weil die zwischen Stände direkt in die nächste Funktion weitergeleitet werden.



Das Box Konstrukt kann eine Art Pipeline aufgebaut werden, bei dem ein Wert durch diese Pipeline geschickt wird und bei jedem `mapf` wird der Wert weiter prozessiert. Um am Schluss an den verarbeitetetn Wert zu kommen wird die letzte Prozzesierung nicht mit `mapf` sondern mit `fold` durchgeführt.



Beispiel:

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



