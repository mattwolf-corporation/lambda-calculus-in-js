# Forschungsarbeit IP5 - Lambda Kalkül

Ziel der Arbeit ist es, neue Konstruktionen aus dem untypisierten Lambda Kalkül mit der Programmiersprache JavaScript zu bauen. Diese Konstruktionen haben das Ziel, JavaScript Applikationen robuster, sicherer und wartbarer zu machen. Bei diesen Konstruktionen setzen wir komplett auf die Werte der funktionalen Programmierung:

* **Purity** \(_pure functions\):_   Funktionen ohne Seiteneffekte \(wie mathematische Funktionen\)
* **Immutabilty** \(_immutable Datastructure\):_  Unveränderliche Datenstrukturen
* **Iteration** : Eine Iteration ohne Ausdrücke wie _`for`_, _`while`_ oder `do` Schleifen

Wir verwenden dabei keine Objektorientierte- oder sonstige nicht funktionale Konzepte.

### Ausgangslage

Da es eine Forschungsarbeit ist haben wir uns eigene Aufgaben überlegt. Folgendes kam dabei raus:

1. Eine eigene kleine Bibliothek von Lambda-Kalkül-Konstruktionen erstellt \([Einfache Kombinatoren](einfache-kombinatoren.md)\).   
   Wie zum Beispiel die _Identitätsfunktion_ :

   ```text
   const id = x => x;
   ```

2. Einen Taschenrechner welcher nur aus Lambda-Kalkül-Konstruktionen programmiert wurde und mit JavaScript-Zahlen sowie mit **Church-Zahlen** Berechnungen ausführen kann \( [Der lambdafizierter Taschenrechner](der-lambdafizierter-taschenrechner.md)\). 
3. Eigene kreierte Stack/Listen-Datenstruktur... 
4. Zum Testen von unseren Konstruktionen haben wir ein eigenes [Test-Framework ](test-framework.md)implementiert.

### Was wir damit erreicht haben





### Was nehmen wir aus dieser Arbeit mit



### Schlussfolgerung, Fazit





