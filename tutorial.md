---
layout: page
title: "Tutorial: Writing mrDSL and fowDSL Programs"
---

<div class="callout-grid">
  <div class="callout-card">
    <h3>What you will learn</h3>
    <p>How to write an mrDSL program that declares metamodels, features and metamorphic relations, and a fowDSL program that configures the search-based generation of follow-up test cases.</p>
  </div>
  <div class="callout-card">
    <h3>Contents of this page</h3>
    <p>Part I covers every construct of mrDSL: metamodels, instances, input and output features, OCL feature definitions, processors, and metamorphic relations. Part II covers fowDSL: follow-up rules, model operations, strategies, fitness functions, and search settings.</p>
  </div>
</div>

Gotten provides two domain-specific languages. **mrDSL** is used to declare the domain metamodels and the Metamorphic Relations (MRs) to be evaluated on a processor, while **fowDSL** configures the search-based generation of follow-up test cases for those MRs. This tutorial walks through both languages construct by construct. The examples come from the [cloud simulator](/gotten), [finite automata](/fa) and [autonomous vehicle](/vehicles) case studies published on this site.

## Part I: The mrDSL language

### 1. Anatomy of an mrDSL program

Every mrDSL program has four parts, in this order: one or more **metamodel declarations**, any number of **features definitions**, an optional **processor description**, and a **`MetamorphicRelations`** block (always present, even if empty):

```
metamodel datacentre "/sample.gotten/model/datac.ecore" with m1, m2
models "/sample.gotten/model/dcmodels"

datacentre input Features {
	context DataCentre def: NNodes: Int = racks->collect(numBoards*board.nodesPerBoard)->sum()
}
output Features {
	Time : Long
}
Processor {
	Name: String
	Version: String
}
MetamorphicRelations {
	MR1 = [(( NNodes(m1) > NNodes(m2) )) implies ((Time(m1) <= Time(m2)))]
}
```

Read it top-down: *which models the tests use*, *which properties of those models matter* (input features), *which results the processor produces* (output features), *what the processor is*, and finally *the relations that must hold between properties and results*.

### 2. Declaring metamodels, instances and models

A metamodel declaration follows this pattern:

```
metamodel <name>? <path-to-ecore> (with <instance> (, <instance>)*)? (models <path-to-models>)?
```

- The optional **name** (e.g. `datacentre`, `word`) identifies the metamodel, so that later features definitions can refer to it.
- The **path** points to the `.ecore` file that defines the domain concepts.
- The **`with` clause** introduces the **instance aliases** (e.g. `m1, m2` or `w1, w2`) that the metamorphic relations will use to refer to pairs (or tuples) of test models.
- The **`models` clause** gives the folder containing the actual model instances used as source test cases.

A program can declare several metamodels when the processor takes several inputs. For instance, the cloud simulator receives a data centre and a workload:

```
metamodel datacentre "/sample.gotten/model/datac.ecore" with m1, m2
models "/sample.gotten/model/dcmodels"
metamodel workload "/sample.gotten/model/workload.ecore" with w1, w2
models "/sample.gotten/model/workloads"
```

### 3. Features definitions

Features are the vocabulary of the metamorphic relations. A features definition block has this shape:

```
(<metamodel>)? (input | output)? Features { <feature>* }
```

- **Input features** are properties *computed from the test models* (typically via OCL). The optional metamodel name in front states which metamodel the features belong to, e.g. `datacentre input Features { ... }` or `word input Features { ... }`.
- **Output features** are the values *produced by the processor* when it executes the test models, e.g. the simulation `Time` and `Energy`, or the `Result` of running a word through an automaton.

Each feature inside the block follows this pattern:

```
(context <Class> def :)? <name> : <DataType> (= <OCL-expression> | := <Java-rule>)?
```

The available **data types** are `Boolean`, `Int`, `Long`, `Double`, `String`, `Set` and `List`.

There are three kinds of features:

- **Plain features**, with just a name and a type. Output features are usually of this kind, since their value comes from the processor:

```
output Features {
	Time : Long
	Energy : Long
}
```

  A plain input feature simply reads a like-named property of the model, as in the autonomous vehicles example: `nominalSpeed: Int`.

- **OCL-derived features**, introduced by `context <Class> def:` and defined by an OCL expression after `=`. The context class is the type in the metamodel from which the expression navigates:

```
datacentre input Features {
	context DataCentre def: NNodes: Int = racks->collect(numBoards*board.nodesPerBoard)->sum()
	context DataCentre def: Network: Int = net->collect(bandwidth)->sum()
}
```

- **Java-defined features**, whose value is computed by a Java class registered in the environment, given after `:=`:

```
context DataCentre def: Balance: Double := "BalanceCalculator"
```

#### The OCL expression subset

The right-hand side of an OCL-derived feature navigates the model starting from the context class. Attributes and references are accessed with a dot (`board.nodesPerBoard`), and collections are processed with the arrow operator `->` followed by a collection operation. The supported collection operations are:

`any`, `asBag`, `asOrderedSet`, `asSequence`, `asSet`, `collect`, `collectNested`, `count`, `excludes`, `excludesAll`, `excluding`, `exists`, `flatten`, `forAll`, `includes`, `includesAll`, `including`, `isEmpty`, `isUnique`, `notEmpty`, `one`, `product`, `reject`, `select`, `size`, `sortedBy` and `sum`.

The object operations `oclAsType`, `oclIsInvalid`, `oclIsKindOf`, `oclIsTypeOf` and `oclIsUndefined` are also available through the dot operator, and conditions inside operations use the relational operators `=`, `<>`, `<`, `<=`, `>` and `>=`, combined with arithmetic (`+`, `-`, `*`, `/`, `%`) and the logical connectives `and` / `or`. Two representative examples from the finite automata case study:

```
context Automaton def: FinalStates: Set = states->select(isFinal = true)->collect(name)->asSet()
context Words def: Word: List = symbol
```

The first collects into a set the names of the states whose `isFinal` attribute is `true`; the second simply exposes the list of symbols of a word.

### 4. The Processor block

The optional `Processor` block declares descriptive attributes of the processor under test — the program that executes the test models, such as a simulator or an analysis tool. Each entry is a `name : DataType` pair:

```
Processor {
	Name: String
	Version: String
}
```

These attributes identify the processor in the reports produced by the generated MT environment.

### 5. Metamorphic relations

The `MetamorphicRelations` block closes the program. Each relation has an optional name and the form *input relation* `implies` *output relation*, between square brackets:

```
MetamorphicRelations {
	<name> = [ <input-expression> implies <output-expression> ]
	...
}
```

The building block of both sides is the **feature application**: a feature name applied to one or more instance aliases declared in the header. `NNodes(m1)` is the value of feature `NNodes` on model `m1`; `Result(x1, w1)` is the output of running automaton `x1` on word `w1`. Feature applications, numbers, strings and booleans are combined with:

- **Logical operators**: `and`, `or`, and the prefix `not`.
- **Relational operators**: `==`, `<>`, `<`, `<=`, `>`, `>=`.
- **Arithmetic operators**: `+`, `-`, `*`, `/`, `%`, plus the prefix negation `~`.
- **Set operations**, applied with `->`: `includes`, `includesAll`, `excludes`, `excludesAll`, `including`, `excluding`, `equals`, `distinct`, `add`, `addAll`, `remove`, `removeAll`, and their `...All` variants.
- **List operations**, applied with `->`: `add`, `remove`, `get`, `indexOf`, `subList`, `replace`, `replaceAll`, `equals`, `distinct`, `reverse`, `shuffle`, `including`, `excluding`.
- **Collection queries**, applied with `->` and empty parentheses: `size()`, `first()`, `last()`.

Sub-expressions are grouped with parentheses. Some relations from the published case studies, in increasing order of sophistication:

A purely numeric relation (cloud simulators): *more nodes with the same workload should not be slower*:

```
MR1 = [(( NNodes(m1) > NNodes(m2) ) and ((w1) == (w2)) ) implies ((Time(m1) <= Time(m2)))]
```

A relation with arithmetic tolerance (autonomous vehicles): *fewer obstacles means less time, and a distance within 15%*:

```
MR2 = [ (obstacleCount(m1) < obstacleCount(m2) ) implies ((timeToDestination(m1) <= timeToDestination(m2) ) and (distance(m2) - distance(m1) <= 0.15 * distance(m2) ))]
```

A relation using set and list operations (finite automata): *appending `1` to a word ending in `0` makes the automaton for `(0+1)*0` reject it*:

```
MR3 = [ (Word(w1)->last() == '0' and Word(w1)->add('1') == Word(w2)) implies ( Result(x1, w1) and not Result(x1, w2))]
```

Conceptually, every MR splits into an **input relation** (a condition on the source and follow-up test cases) and an **output relation** (the condition their results must satisfy). This decomposition is what fowDSL exploits to generate follow-up test cases automatically.

## Part II: The fowDSL language

### 6. Anatomy of a fowDSL program

A fowDSL program configures, for one metamodel and one or more MRs, how follow-up test cases are searched for. Its generation method is based on [MOMoT](http://martin-fleck.github.io/momot/). The overall structure is:

```
followups for <metamodel> (using <MR> (, <MR>)*)?
(with source (models = { <model> (, <model>)* } | path = <folder>))?
(and output folder = <folder>)?

<follow-up rules>

(: <strategy>)?
(maximize | minimize) ( <expression> )
(population <n>)?
(maxSolutions <n>)?
(iterations <n>)?
(runs <n>)?
(algorithms [ <algorithm> (, <algorithm>)* ])?
```

### 7. The header

The header selects the target metamodel (by the name declared in the mrDSL program) and, optionally, the metamorphic relations for which follow-ups are generated, the source test cases, and the output folder:

```
followups for datacentre using MR1
with source path = "/sample.gotten/model/dcmodels"
and output folder = "/sample.gotten/model/dcmodels"
```

The source can be given either as a folder (`path = "..."`) or as an explicit set of models (`models = {"m01.xmi", "m02.xmi"}`).

### 8. Follow-up rules and model operations

Follow-up rules are the heart of a fowDSL program. Each rule targets one input feature and lists, after an arrow, the model operations that the search may apply to alter its value; several operations are chained with semicolons:

```
(increase)? (<feature>)? -> <operation> (; <operation>)*
```

The optional leading keyword `increase` states the intended direction of change of the feature. For example, the following rule decreases the `NNodes` feature by removing boards from racks and nodes from boards, while keeping both counts positive:

```
NNodes ->  decrease [1..4] Rack.numBoards keeping {Rack.numBoards > 0};
           decrease [1..4] Board.nodesPerBoard keeping {Board.nodesPerBoard > 0}
```

There are five kinds of model operations. In every one of them, the optional bracketed amount is either a fixed number `[n]` or a range `[min..max]`, and the affected feature is reached by a dotted path from a class (`Class.feature` or `Class.ref.feature`):

- **Numeric modifications** change the value of a numeric attribute:

```
(increase | decrease | negate) ([n] | [min..max])? <Class>.<feature> (keeping { <Class>.<feature> <op> <limit> } (, ...)? )?
```

  The `keeping` clause guards the operation with one or more numeric conditions using `<`, `<=`, `>`, `>=`, `==`, `<>`, so the search never produces invalid values (e.g. `keeping {Rack.numBoards > 0}`).

- **Object modifications** create or delete objects:

```
(create | delete) ([n] | [min..max])? <Class> (keeping { <Class>.<ref> -> size() <op> <limit> })? (in <ContainerClass>(.<ref>)?)?
```

  For instance, `create [1..2] Rack in DataCentre.racks` adds one or two racks to the data centre, and a `keeping { ... ->size() > 1 }` condition can preserve a minimum population of objects.

- **Boolean modifications** set or flip a boolean attribute:

```
set <Class>.<feature> (to)? (true | false | reverse) ([n] | [min..max])?
```

  For example, `set State.isFinal to reverse [1]` flips the finality of one state.

- **Enumeration modifications** force an enumerated attribute to a given literal:

```
require <Class>.<feature> == <EnumLiteral> ([n] | [min..max])?
```

- **Model-level conditions** state that some declared instances must remain equal — typically the inputs that the MR requires to stay unchanged:

```
keeping { w1 == w2 }
```

### 9. Generation strategies

After the rules, an optional strategy selects the mechanism used to realise the model operations:

```
: henshinStrategy
```

The available strategies are `henshinStrategy` (graph transformations with [Henshin](https://www.eclipse.org/henshin/)), `eolStrategy` (Epsilon Object Language scripts), `wodelStrategy` (mutations with [Wodel](https://gomezabajo.github.io/Wodel)) and `chatGPTStrategy` (LLM-generated follow-ups).

### 10. The fitness function

The fitness function guides the search. It is the keyword `maximize` or `minimize` followed by an expression in the same language used for metamorphic relations, typically measuring how far the follow-up test case moves the relevant feature:

```
maximize ( NNodes(m2) - NNodes(m1) )
```

### 11. Search settings

The program closes with the optional search-configuration parameters:

- **`population <n>`** — size of the population of candidate follow-ups.
- **`maxSolutions <n>`** — maximum number of follow-up test cases to keep.
- **`iterations <n>`** — number of iterations of the search.
- **`runs <n>`** — number of independent runs.
- **`algorithms [ ... ]`** — the search algorithms to apply, among `Random`, `NSGAII`, `NSGAIII` and `eMOEA`.

### 12. A complete fowDSL example

The following program, from the [cloud simulator case study](/gotten), generates follow-up data centre models for `MR1` by shrinking the number of computing nodes, and evaluates the reduction with four search algorithms:

```
followups for datacentre using MR1
with source path = "/sample.gotten/model/dcmodels"
and output folder = "/sample.gotten/model/dcmodels"

NNodes ->  decrease [1..4] Rack.numBoards keeping {Rack.numBoards > 0};
           decrease [1..4] Board.nodesPerBoard keeping {Board.nodesPerBoard > 0}

maximize ( NNodes(m2) - NNodes(m1) )

maxSolutions 10
iterations 2
algorithms [Random, NSGAII, NSGAIII, eMOEA]
```

Read together with the mrDSL relation `MR1 = [(( NNodes(m1) > NNodes(m2) ) and ((w1) == (w2)) ) implies ((Time(m1) <= Time(m2)))]`, the intent is clear: the search produces follow-up models `m2` with strictly fewer nodes than the source `m1` (satisfying the input relation), so that the MT environment can then check whether the simulator's reported times satisfy the output relation.

## Where to go next

To install Gotten and run these programs in Eclipse, see the installation options on the [framework details](/gotten) page. Complete worked examples are available for [cloud simulators](/evaluation), [finite automata](/fa), [autonomous vehicles](/vehicles) and [video streaming APIs](/video).

### Acknowledgements

This work was funded by the Spanish Ministry of Science through project MASSIVE (RTI2018-095255-B-I00) and by the Madrid R&D programme through project [FORTE](https://antares.sip.ucm.es/forte-cm/) (P2018/TCS-4314).
