# Forschungsarbeit IP5 - Lambda Kalkül

### Einleitung

Ziel der Arbeit ist es, neue Konstruktionen aus dem untypisierten Lambda Kalkül mit der Programmiersprache JavaScript zu bauen. Diese Konstruktionen haben das Ziel, JavaScript Applikationen robuster, sicherer und wartbarer zu machen. Bei diesen Konstruktionen setzen wir komplett auf die Werte der funktionalen Programmierung:

* **Purity** \(_pure functions\):_   Funktionen ohne Seiteneffekte \(wie mathematische Funktionen\)
* **Immutabilty** \(_immutable Datastructure\):_  Unveränderliche Datenstrukturen
* **Iteration** : Eine Iteration ohne Ausdrücke wie _`for`_, _`while`_ oder `do` Schleifen

Wir verwenden dabei keine Objektorientierte- oder sonstige nicht funktionale Konzepte.

### Ausgangslage

Da es bei dieser Forschungsarbeit keine konkrete Aufgabe gibt, sondern nur eine Übergeordnetes Ziel, haben wir uns eigene Aufgaben überlegt. Folgendes kam dabei raus:

1. Als erstes wurde eine eigene kleine Bibliothek von Lambda-Kalkül-Konstruktionen zusammengestellt \([Einfache Kombinatoren](einfache-kombinatoren.md)\), und mit eigenen Kreationen ergänzt, um diese später in weiteren grösseren Konstruktionen zu verwenden. Diese Bibliothek dient als Werkzeugkasten und ist somit das Fundament unserer Forschungsarbeit.  
  
   Wie zum Beispiel die _Identitätsfunktion_ :

   ```text
   const id = x => x;
   ```

2. Einen Taschenrechner welcher nur aus Lambda-Kalkül-Konstruktionen programmiert wurde. Der Taschenrechner kann mit JavaScript-Zahlen und mit **Church-Zahlen** Berechnungen ausführen  \( [Der lambdafizierter Taschenrechner](der-lambdafizierter-taschenrechner.md)\). Die Church-Zahlen gehören auch zum Fundament der Forschungsarbeit und dienen später dazu, um  **Iterationen** durchzuführen. 
3. Als weitere Herausforderung wollten wir eine unveränderliche Datenstruktur erstellen. Dabei wurde nach eine einfachen Datenstruktur  gesucht, auf welche  weitere Datenstrukturen erstellt werden können. Dabei entstand der [Immutable Stack](immutable-stack.md). Das Ziel dieser unveränderlichen Datenstruktur ist, dass bei der Verarbeitung der Daten keine Fehler, die durch Seiteneffekte von anderen Funktionen, enstehen können. 
4. Zum Testen von unseren Konstruktionen wurde ein eigenes [Test-Framework ](test-framework.md)implementiert. Es dienst als  Qualitätssicherung \(Überprüfung der Funktionalität\) und ist eine fortlaufende Unterstützung beim _Refactoring_ der Konstruktionen.

### Was wir damit erreicht haben





### Was nehmen wir aus dieser Arbeit mit...

Der Lerneffekt in dieser Forschungsarbeit war für uns immens.

Die auseinandersetzung mit der Materie des Lambda Kalkül hat unser wissen  Wir haben viel funktionales Programmieren gelernt, 

Diese Arbeit hat uns den Grundstein zu anderen Funktionalen Programmiersprachen gelegt. Wir beherschen die wichtigsten Funktionalen Konzepte und können diese nun anwenden. 



### Schlussfolgerung, Fazit





