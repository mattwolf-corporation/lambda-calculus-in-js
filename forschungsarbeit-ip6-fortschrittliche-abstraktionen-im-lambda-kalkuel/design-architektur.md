# Design-Architektur

Warum haben wir was gemacht

Warum ...

* Listmap
* Maybe
* Verbesserung ForEach

## **Code Convention**

Bei Abfragefunktionen, mit welcher der Anwendern ein Wert anfordert, gibt der jeweilige Präfix des Funktionsnamen Aufschluss, von welchem Typ der Rückgabewert sein wird.

### get-Funktionen

Funktionen die mit einem **get** beginnen, geben wenn möglich den gewünschten Wert oder ein _undefined_ zurück mit einem Error-Log auf der Konsole. Gleich wie man es von JavaScript gewohnt ist. 

> Funktionen: **get**XY  
> Ergebnis:     **Wert** oder _**undefined**_  ****\(inkl. console.error  \)

Beispiele: [getElementByIndex](immutable-stack-erweiterungen.md#getelementbyindex), [getIndexOfElement](immutable-stack-erweiterungen.md#getindexofelement), getDomElement, 

### maybe-Funktionen

Funktionen die mit einem **maybe** beginnen, geben wenn möglich den gewünschten Wert im [Maybe-Typ](maybe.md#maybe-type) `Just` verpackt oder ein `Nothing` zurück.

> Funktionen: **maybe**XY   
> Ergebnis:     **Just\(Wert\)** oder **Nothing**

Beispiele: maybeDivision, maybeTruthy, maybeDomElement, maybeNumber





maybeElementXY: Just\(value\) oder NothingeitherElementXY

#### either 

 Left\(error\) oder Right\(value\)

### In der JS-Paradigma



\*\*\*\*

**:**  





