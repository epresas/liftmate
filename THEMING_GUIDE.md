# Guía de Temas: Arquitectura de Tokens (Primitivas vs Semánticas)

En este proyecto utilizamos una arquitectura de tokens de dos capas para que el diseño sea escalable, mantenible y soporte temas (como el modo oscuro) de forma sencilla.

## 1. Las Dos Capas de Tokens

### Capa 1: Primitivas (La Paleta Cruda)
Son los colores base de tu marca. No tienen significado de uso, solo definen el valor del color.
Se nombran por su color y tono (ej. `slate-50`, `navy-900`).

```css
--pr-slate-50: #F8FAFC;
--pr-white: #FFFFFF;
--pr-navy-900: #1E3A5F;
```

### Capa 2: Semánticas (El Significado)
Estos tokens definen **dónde** se usa el color. No tienen valores hexadecimales directos; **referencian a las primitivas**.
Esto permite que, por ejemplo, el modo oscuro sea solo un "mapeo" diferente a las mismas primitivas.

```css
/* En Light Mode */
--background: var(--pr-slate-50);
--card: var(--pr-white);

/* En Dark Mode */
--background: var(--pr-slate-900);
--card: var(--pr-navy-950);
```

---

## 2. Ventajas de esta Arquitectura

1.  **Cero Duplicación:** Si quieres cambiar el blanco por un blanco roto en toda la app, solo cambias `--pr-white` en un lugar.
2.  **Mantenibilidad:** Si decides que las tarjetas ahora deben ser de un gris muy suave en lugar de blancas, solo cambias el mapeo de `--card` a `--pr-slate-50`. No tienes que buscar y reemplazar `#FFFFFF` por todo el código.
3.  **Modo Oscuro Facilitado:** El modo oscuro es simplemente cambiar a qué primitiva apunta cada alias semántico dentro de la clase `.dark`.

---

## 3. ¿Cómo usar estos colores?

**REGLA DE ORO:** En tus componentes, **siempre usa tokens semánticos**. Nunca uses primitivas directamente (a menos que sea un caso muy especial).

**Bien (Usa el significado):**
```css
.card {
  background-color: var(--card);
  color: var(--card-foreground);
}
```

**Mal (Usa el color crudo):**
```css
.card {
  background-color: var(--pr-white); /* Si cambias a modo oscuro, esto se quedará blanco! */
}
```

---

## 4. ¿Cómo añadir un color nuevo?

1.  Añade el color a las **Primitivas** en `src/styles.scss` (ej. `--pr-brand-500: #...`).
2.  Crea un alias **Semántico** que lo use (ej. `--button-primary: var(--pr-brand-500)`).
3.  Usa el alias semántico en tu componente.
