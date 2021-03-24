# Design Entscheidungen und Begründungen

### Wie ist die ListMap entstanden?

Beim ersten Entwurf des Observables wurde für die Verwaltung der Listener die Stack Datenstruktur verwendet. Bei der Implementierung für das abmelden/entfernen der Listener wurde klar das dies mit einem Stack nicht bzw. nicht elegant gelöst werden kann. Dabei kam die Idee einer HashMap auf umd einen Listener per Schlüssel abzuspeichern und wieder zu entfernen. Das Problem einer HashMap ist das dies ein gute Hash-Funktion voraussetzt und die ist eine bekanntlich Schweres Problem in der Informatik. Auch für den direkten Zugriff auf eine HashMap wussten wir nicht wie wir dies implementieren wolltemn. Da kam uns die Idee das wir eine Liste mit Schlüssel-Wertpaaren entwicklen können ohne diese zu Hashen und für den Zugriff mit Iteration durch die Liste zugreifen. Der Schlüssel sollte eindeutig und mit dem JavaScript === Operator auf Gleichheit verglichen werden können. Eine alternative Implementierung wäre eine Art Binär Baum, dies wäre aber sehr komplex und nicht nötig für unsere Einsatz Zwecke. Vorteil von unsere Implementierung wir verwenden den bereits existierenden Stack und erweitern diesen und so enstand die ListMap Datenstruktur.

#### Wieso haben wir IF und LazyIF \(wieso braucht zum beispiel stackEquals lazyif \)  

#### Eager-Evaluation von JavaScript  mit Lazy-Funktion umgehen



