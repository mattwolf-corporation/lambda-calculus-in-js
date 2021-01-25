# Performance

## Foreach-Methode des Immutable-Stack

 Die Performance der **Foreach**-Methode war dermassen schlecht und konnte um das 1200-Fache verbessert werden. Anstelle den Index aus dem Stack via **`jsnum`** rekursiv zu berechnen und der Interne Iteration hatte die **Foreach** eine Komplexität von mindestens _0\(n\)^2_, wurde der Index in der Iteration einfach nur aufgezählt.  
Das Problem liegt an den Churchzahlen welche intern aus rekursiven Funktionen besteht und bei zu vielen Kalkulationen und Verknüpfungen mit den Churchzahlen rasch die Komplexität exponentiell wächst.  


