---
layout: page
title: "Framework Details"
---

<div class="callout-grid">
  <div class="callout-card">
    <h3>What Gotten supports</h3>
    <p>Define domain-specific metamorphic relations with mrDSL, execute them on domain processors, and generate follow-up test cases with fowDSL.</p>
  </div>
  <div class="callout-card">
    <h3>Contents of this page</h3>
    <p>This page presents the framework concept, both domain-specific languages, installation options, sample projects, demonstrations, contributors, and related publications.</p>
  </div>
</div>

Gotten uses model-driven engineering to automate the construction of Metamorphic Testing (MT) environments. It takes a meta-model that captures the concepts of a domain and a description of the domain execution environment as input. From these artefacts, it generates an MT environment that supports the definition and evaluation of domain-specific Metamorphic Relations (MRs), detailed reporting of test results, and search-based generation of follow-up test cases.

### Defining and executing metamorphic relations with mrDSL

The generated environment includes a domain-specific language called **mrDSL**. An mrDSL program declares the domain meta-models and model instance names, input features expressed through OCL, output features, processor attributes, and the MRs to be evaluated.

```
metamodel datacentre "/sample.gotten/model/datac.ecore" with m1, m2
models "/sample.gotten/model/dcmodels"
metamodel workload "/sample.gotten/model/workload.ecore" with w1, w2
models "/sample.gotten/model/workloads"

datacentre input Features {
	context DataCentre def: NNodes: Int = racks->collect(numBoards*board.nodesPerBoard)->sum()
	context DataCentre def: CPU: Int = racks->collect(
            numBoards*board.nodesPerBoard*board.nodeType.CPUCores*board.nodeType.CPUSpeed)->sum()
}
output Features {
	Time : Long
	Energy : Long
}
Processor {
	Name: String
	Version: String
}
MetamorphicRelations {
	MR1 = [(( NNodes(m1) > NNodes(m2) ) and ((w1) == (w2)) ) implies ((Time(m1) <= Time(m2)))]
	MR2 = [(( CPU(m1) > CPU(m2) ) and ((w1) == (w2)) ) implies ((Energy(m1) <= Energy(m2)))]
}
```

### Generating follow-up test cases with fowDSL

Gotten also provides **fowDSL**, which configures the generation of follow-up test cases. Its generation method is based on [MOMoT](http://martin-fleck.github.io/momot/). For each MR, a fowDSL program defines the permitted model operations, their limits, the optimisation objective, and the search algorithms to be applied.

```
followups for datacentre using MR1
with source folder = "/sample.gotten/model/dcmodels"
and output folder = "/sample.gotten/model/dcmodels"

NNodes ->  decrease [1..4] Rack.numBoards keeping {Rack.numBoards > 0};
           decrease [1..4] Board.nodesPerBoard keeping {Board.nodesPerBoard > 0}

maximize ( NNodes(m2) - NNodes(m1) )

maxSolutions 10
iterations 2                               
algorithms [Random, NSGAII, NSGAIII, eMOEA]
```

### Installation

- Install Gotten from the [Eclipse update site](https://g0tten.github.io/gotten/update-site) by using the Eclipse **Install New Software** facility.

![Installing Gotten from the Eclipse update site](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_update-site.png)

- Download the [standalone Eclipse with Gotten for Windows](https://www.dropbox.com/scl/fi/a88m5zd4y4umlbo4zyguj/eclipse.zip?rlkey=722pcm0biosv8u4rnpfzegyw8&dl=0).
- Download the [standalone Eclipse with Gotten for Ubuntu](https://www.dropbox.com/scl/fi/qnwgkz7r0dk0aa97qe5m0/eclipse.zip?rlkey=oqfhb39zwi8ncqp1ogs20aogz&dl=0).
- Download the [Ubuntu 20.04 VirtualBox virtual machine with Gotten pre-installed](https://www.dropbox.com/s/m4s7rjk1tywl8cf/Ubuntu-20.04.x64-Gotten.zip?dl=0).

### Sample projects

#### Cloud simulators

- [Simple Gotten cloud project](https://github.com/g0tten/sample/zipball/main)
- [Gotten cloud evaluation project](https://github.com/g0tten/evaluation/zipball/main)

#### Video streaming APIs

- [Gotten for YouTube and Vimeo](https://github.com/g0tten/video/zipball/main)

### Demonstrations

Select the image below to watch the Gotten development environment in operation.

[![Gotten development environment in action](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_screenshot.png)](https://youtu.be/PVVtZCxcnNc)

Select the following image to watch a short introductory presentation of the framework.

[![Introductory presentation of the Gotten environment](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_screenshot2.png)](https://youtu.be/DeuIW6V4LaQ)

The following image shows the wizard that guides the execution of the MT process.

![Gotten wizard for executing the MT process](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_wizard.png)

### Authors and contributors

Gotten has been developed by [Pablo Gómez-Abajo](https://github.com/gomezabajo), [Pablo C. Cañizares](https://github.com/PabloCCanizares), [Alberto Núñez](https://github.com/albenune), [Esther Guerra](https://github.com/estherguerra), and [Juan de Lara](https://github.com/jdelara).

We also acknowledge the developers of the frameworks used to implement Gotten:

- [Xtext](https://www.eclipse.org/Xtext/) supports the development of programming languages and domain-specific languages through a grammar-based approach.
- [Henshin](https://www.eclipse.org/henshin/) is used to define the transformation units that manipulate models.
- [MOMoT](http://martin-fleck.github.io/momot/) combines model-driven engineering with search-based optimisation to solve complex model-level problems.

### Related publications

4. [Towards metamorphic testing with LLM-based workflows: Metamorphic relation inference and follow-up test case generation](https://www.sciencedirect.com/science/article/pii/S0950584926001394). Pablo C. Cañizares, Pablo Gómez-Abajo, Esther Guerra, Juan de Lara. 2026. In [*Information and Software Technology*](https://www.sciencedirect.com/journal/information-and-software-technology), Elsevier.
3. [<span style="font-variant:small-caps;">Gotten</span>: A model-driven solution to engineer domain-specific metamorphic testing environments](https://ieeexplore.ieee.org/document/10350786). Pablo Gómez-Abajo, Pablo C. Cañizares, Alberto Núñez, Esther Guerra, Juan de Lara. 2023. In the [*ACM/IEEE 26th International Conference on Model Driven Engineering Languages and Systems (MoDELS 2023)*](https://conf.researchr.org/home/models-2023), Västerås.
2. [Automated engineering of domain-specific metamorphic testing environments](https://www.sciencedirect.com/science/article/pii/S0950584923000186). Pablo Gómez-Abajo, Pablo C. Cañizares, Alberto Núñez, Esther Guerra, Juan de Lara. 2023. In [*Information and Software Technology*](https://www.sciencedirect.com/journal/information-and-software-technology), Elsevier.
1. [New ideas: Automated engineering of metamorphic testing environments for domain-specific languages](https://dl.acm.org/doi/10.1145/3486608.3486904). Pablo C. Cañizares, Pablo Gómez-Abajo, Alberto Núñez, Esther Guerra, Juan de Lara. 2021. In the [*ACM SIGPLAN International Conference on Software Language Engineering (SLE 2021)*](https://conf.researchr.org/home/sle-2021?), Chicago. **Best New Ideas/Vision Paper Award at SLE 2021.**
{: reversed="reversed"}

### Acknowledgements

This work was funded by the Spanish Ministry of Science through project MASSIVE (RTI2018-095255-B-I00) and by the Madrid R&D programme through project [FORTE](https://antares.sip.ucm.es/forte-cm/) (P2018/TCS-4314).
