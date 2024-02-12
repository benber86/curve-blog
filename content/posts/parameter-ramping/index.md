---
title: "Parameter Ramping"
draft: false
date: 2024-02-11T09:16:45.000Z
description: "Why aren't parameter changes on Curve pools applied instantly? This post dwelves into the reasons behind gradual paramater changes."
categories:
  - Parameters
  - Pools
tags:
  - Stableswap
  - Invariant
  - Parameters
---

<script src="../../js/parameters/poolsim.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

## A quick refresher on Curve's Stableswap

$A n^n \sum{x_i} + D = A n^n D + \frac{D^{n+1}}{(n^n \prod{x_i})}$


<script src="../../js/parameters/bondingCurve.js"></script>


<style>
    #bondingChartContainer {
        width: 800px;
        height: 400px;
    }
    #aSliderBond {
        width: 92%;
    }
    input[type="number"] {
        width: 20%;
    }
</style>


<label for="x1InputBond">x1:</label>
<input type="number" id="x1InputBond" value="5000" min="0">
<label for="x2InputBond">x2:</label>
<input type="number" id="x2InputBond" value="8000" min="0">
<br>
<label for="aSliderBond">A:</label>
<input type="range" id="aSliderBond" value="20" min="1" max="500">
<span id="aValueBond">100</span>
<div id="bondingChartContainer">
    <canvas id="bondingChart"></canvas>
</div>

## What else happens when we change A ?


We already saw above how A alters the AMM's bounding curve... 

---

<style>
    #container {
        width: 600px;
        margin: auto;
    }
    .dValueDisplay {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
    }
    input[type="number"], input[type="range"] {
        width: 25%;
        border: 1px;
        margin: 10px 0; /* Small margin for vertical spacing */
    }
    #aSlider {
        width: 85%;
        text-align: center;
    }
</style>

<div id="container">
    <label for="x2Input">Token A ($x_1$):</label>
    <input type="number" id="x1Input" min="0" max="10000" value="1000">
    &nbsp; <!-- Non-breaking space for simple spacing -->
    <label for="x2Input">Token B ($x_2$):</label>
    <input type="number" id="x2Input" min="0" max="10000" value="5000">
    <br>
    <label for="aSlider">A:</label>
    <input type="range" id="aSlider" min="0" max="200" value="100">
    <span id="aValue">100</span>
    <div class="dValueDisplay" id="dValue">D: </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const x1Input = document.getElementById('x1Input');
        const x2Input = document.getElementById('x2Input');
        const aSlider = document.getElementById('aSlider');
        const aValue = document.getElementById('aValue');
        const dValueDisplay = document.getElementById('dValue');

        function updateDValue() {
            const xp = [parseInt(x1Input.value), parseInt(x2Input.value)];
            const A = parseInt(aSlider.value);
            const D = calculateD(xp, A);
            dValueDisplay.textContent = 'D: ' + D.toFixed(2);
        }

        x1Input.addEventListener('input', updateDValue);
        x2Input.addEventListener('input', updateDValue);
        aSlider.addEventListener('input', () => {
            aValue.textContent = aSlider.value;
            updateDValue();
        });

        updateDValue();
    });
</script>

<style>
    #chartContainer {
        width: 600px;
        height: 300px;
    }
    input[type="range"] {
        width: 60%;
    }
</style>

<label for="x1Slider">Token A ($x_1$):</label>
<input type="range" id="x1Slider" min="1" max="10000" value="1000">
<span id="x1Value">2000</span>
<br>
<label for="x2Slider">Token B ($x_2$):</label>
<input type="range" id="x2Slider" min="1" max="10000" value="5000">
<span id="x2Value">5000</span>
<br>
<div id="chartContainer">
    <canvas id="ammChart"></canvas>
</div>

<script src="../../js/parameters/dChart.js"></script>


---
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

# Emphasis

---

Emphasis, aka italics, with asterisks or underscores. **Strong emphasis**, aka bold, with asterisks or underscores. Combined emphasis with asterisks and underscores. ~~Strikethrough~~ with two tildes. **_Bold and nested italic_**. **_All bold and italic_**. **_*Bold and italic nested*_**.

# Lists

---

## Ordered:

1. First ordered list item
2. Another item
3. Actual numbers don't matter, just that it's a number
   1. 1st.
   1. 2nd.
   1. 3rd.

## Unordered:

- This is a list item
  - This is a nested list item
    - This is a nested list item
  - This is another list item
- This is another list item

## Task:

{{< task-list >}}

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

# Links

---

[This is a link](https://www.example.com).

[This link](https://www.example.com "Link Title") has a title attribute.

# Tables

---

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

# Blockquotes

---

> Blockquotes are very handy in email to emulate reply text. This line is part of the same quote.

You can reference a footnote like this.

> All generalizations are false, including this one. — Mark Twain. [^1]

[^1]: https://www.brainyquote.com/quotes/mark_twain_137872.

# Code

---

Inline `code` has `back-ticks around` it.

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
s = "Python syntax highlighting"
print(s)
```

```plain
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```

You can remove line numbers, change the highlighting theme, and more. See [Syntax Highlighting](https://gohugo.io/content-management/syntax-highlighting/) and [Highlight](https://gohugo.io/getting-started/configuration-markup/#highlight/).

```c {lineNos=false}
#include <stdio.h>

int main()
{
    printf("Hello, World!\n");
    return 0;
}
```

# Alerts

---

{{< alert info "Optional title" >}}
This is an info alert.
{{< /alert >}}

{{< alert warning "Optional title" >}}
This is a warning alert.
{{< /alert >}}

{{< alert error "Optional title" >}}
This is an error alert.
{{< /alert >}}

{{< alert success "Optional title" >}}
This is a success alert.
{{< /alert >}}

# Math

---

You can use LaTeX-style math with `$` and `$$` delimiters. For example, `$x^2$` renders as $x^2$, and `$$\frac{x}{y}$$` renders as: $$\frac{x}{y}$$

We can throw this scary-looking equation at you:

$$
\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\ldots} } } }
$$

# Horizontal Rules

---

Three or more... Hyphens `---`, Asterisks `***`, or Underscores `___`.

---

---

---

# Miscellaneous

---

Tailwind lets you conditionally apply utility classes in different states using variant modifiers. For example, use `hover:scroll-auto` to only ~~The world is flat.~~
apply the scroll-auto utility on hover.

term
: definition
: another definition
