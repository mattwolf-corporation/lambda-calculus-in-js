# Code Convention

## Naming

Bei Abfragefunktionen, mit welcher der Anwender einen Wert anfordert, gibt der jeweilige Präfix des Funktionsnamens Aufschluss, von welchem Typ der Rückgabewert sein wird.

### get-Präfix

Funktionen die mit einem **get** beginnen, geben wenn möglich den gewünschten Wert ansonsten ein _undefined_ zurück mit einem Error-Log auf der Konsole. 

> Funktion:     **get**XYZ  
> Ergebnis:     **Wert** oder _**undefined**_  ****\(inkl. console.error  \)

Beispiele: [getElementByIndex](immutable-stack-erweiterungen.md#getelementbyindex), [getIndexOfElement](immutable-stack-erweiterungen.md#getindexofelement), getDomElement, 

### maybe-Präfix

Funktionen die mit einem **maybe** beginnen, geben im Erfolgsfall ein [`Just`](maybe.md#maybe-type) mit den gewünschten Wert, ansonsten ein [`Nothing`](maybe.md#maybe-type) zurück.

> Funktion:      **maybe**XYZ  
> Ergebnis:     **Just\(Wert\)** oder **Nothing**

Beispiele: [maybeDivision](maybe.md#maybedivision), [maybeTruthy](maybe.md#maybetruthy), [maybeDomElement](maybe.md#maybedomelement), [maybeNumber](maybe.md#maybenumber)

### either-Präfix

Funktionen die mit einem **either** beginnen, geben im Erfolgsfall ein [`Right`](either.md#either-type) mit dem Resultat, ansonsten ein [`Left`](either.md#either-type) mit einer Fehlermeldung zurück.

> Funktionen: **either**XY   
> Ergebnis:     **Left\(Fehlerbehandlung\)** oder **Right\(Wert\)**

Beispiele: [eitherTruhty](either.md#eithertruthy), [eitherNotNullAndUndefined](either.md#eithernotnullandundefined), [eitherDomElement](either.md#eitherdomelement), [eitherNumber](either.md#eithernumber), [eitherFunction](either.md#eitherfunction)









