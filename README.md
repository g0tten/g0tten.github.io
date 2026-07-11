<p align="center">
  <a href="https://g0tten.github.io">
    <img src="https://g0tten.github.io/assets/res/gotten.png" width="120" height="120" alt="Gotten logo" />
  </a>
</p>

<h1 align="center">Gotten</h1>

<p align="center"><i><strong>G</strong>eneric MDE framework f<strong>O</strong>r me<strong>T</strong>amorphic <strong>TE</strong>sti<strong>N</strong>g</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0-blue" alt="Version 2.0">
  <a href="https://github.com/g0tten/g0tten.github.io/graphs/contributors"><img src="https://img.shields.io/github/contributors/g0tten/g0tten.github.io" alt="Contributors"></a>
  <a href="https://github.com/g0tten/g0tten.github.io/network/members"><img src="https://img.shields.io/github/forks/g0tten/g0tten.github.io" alt="Forks"></a>
  <a href="https://github.com/g0tten/g0tten.github.io/stargazers"><img src="https://img.shields.io/github/stars/g0tten/g0tten.github.io" alt="Stars"></a>
  <a href="https://raw.githubusercontent.com/g0tten/g0tten.github.io/master/LICENSE"><img src="https://img.shields.io/github/license/g0tten/g0tten.github.io" alt="Licence"></a>
</p>

<p align="center">
  <a href="https://g0tten.github.io">Website</a> &middot;
  <a href="https://github.com/g0tten/g0tten.github.io/issues">Report a problem</a>
</p>

Gotten is a model-driven engineering framework that automates the construction of domain-specific **Metamorphic Testing (MT)** environments. Starting from a meta-model that captures the concepts of a domain and a description of the domain execution environment, Gotten produces a tailored MT environment. This environment supports the definition and evaluation of domain-specific Metamorphic Relations (MRs), detailed reporting of test results, and the automated search-based generation of follow-up test cases.

Gotten has been applied to cloud simulators, video streaming APIs, autonomous vehicles, and finite automata.

🌐 **Project website:** https://g0tten.github.io/

> **About this repository:** This repository contains the source files for the Gotten project website. It also hosts the Eclipse update site for the Gotten environment under [`gotten/update-site`](https://g0tten.github.io/gotten/update-site/).

## Installation

Gotten is distributed as a set of Eclipse plug-ins and requires **Java 21**.

### Option 1: Install from the update site (recommended)

1. In Eclipse, select **Help → Install New Software…**
2. Select **Add…** and enter the Gotten update-site address:

   ```
   https://g0tten.github.io/gotten/update-site/
   ```

3. Select **Gotten**, choose **Next**, and follow the installation wizard.
4. Restart Eclipse when requested.

### Option 2: Use a pre-packaged distribution

- [Standalone Eclipse with Gotten for Windows](https://www.dropbox.com/scl/fi/vkur2m59l42bg41mbjb9b/eclipse.zip?rlkey=714vya0es6bal55qp2rwqyz4c&dl=0)
- [Standalone Eclipse with Gotten for Ubuntu](https://www.dropbox.com/scl/fi/qnwgkz7r0dk0aa97qe5m0/eclipse.zip?rlkey=oqfhb39zwi8ncqp1ogs20aogz&dl=0)
- [Ubuntu 20.04 VirtualBox virtual machine with Gotten pre-installed](https://www.dropbox.com/s/m4s7rjk1tywl8cf/Ubuntu-20.04.x64-Gotten.zip?dl=0)

## A short example

Gotten provides a DSL called **mrDSL** for defining and executing Metamorphic Relations. The following program targets cloud simulators. It declares the domain meta-models, input features expressed through OCL, output features, processor attributes, and two MRs.

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

A second DSL, **fowDSL**, configures the search-based generation of follow-up test cases. This functionality is based on [MOMoT](http://martin-fleck.github.io/momot/).

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

## Demonstrations

- [Video demonstration of the Gotten environment](https://youtu.be/PVVtZCxcnNc)
- [Short introductory presentation of Gotten](https://youtu.be/DeuIW6V4LaQ)

## Sample projects

- [Simple Gotten cloud project](https://github.com/g0tten/sample)
- [Gotten cloud evaluation project](https://github.com/g0tten/evaluation)
- [Gotten for video streaming APIs: YouTube and Vimeo](https://github.com/g0tten/video)

## Publications

1. Cañizares, P. C., Gómez-Abajo, P., Guerra, E., de Lara, J., 2026. [Towards metamorphic testing with LLM-based workflows: Metamorphic relation inference and follow-up test case generation](https://www.sciencedirect.com/science/article/pii/S0950584926001394). In *Information and Software Technology*, Elsevier.
2. Gómez-Abajo, P., Cañizares, P. C., Núñez, A., Guerra, E., de Lara, J., 2023. [Gotten: A model-driven solution to engineer domain-specific metamorphic testing environments](https://ieeexplore.ieee.org/document/10350786). In the *ACM/IEEE 26th International Conference on Model Driven Engineering Languages and Systems (MoDELS 2023)*, Västerås.
3. Gómez-Abajo, P., Cañizares, P. C., Núñez, A., Guerra, E., de Lara, J., 2023. [Automated engineering of domain-specific metamorphic testing environments](https://www.sciencedirect.com/science/article/pii/S0950584923000186). In *Information and Software Technology*, Elsevier.
4. Cañizares, P. C., Gómez-Abajo, P., Núñez, A., Guerra, E., de Lara, J., 2021. [New ideas: Automated engineering of metamorphic testing environments for domain-specific languages](https://dl.acm.org/doi/10.1145/3486608.3486904). In the *ACM SIGPLAN International Conference on Software Language Engineering (SLE 2021)*, Chicago. 🏆 **Best New Ideas/Vision Paper Award at SLE 2021.**

## Authors and contributors

Gotten has been developed by [Pablo Gómez-Abajo](https://github.com/gomezabajo), [Pablo C. Cañizares](https://github.com/PabloCCanizares), [Alberto Núñez](https://github.com/albenune), [Esther Guerra](https://github.com/estherguerra), and [Juan de Lara](https://github.com/jdelara).

We acknowledge the developers of the frameworks used to implement Gotten:

- [Xtext](https://www.eclipse.org/Xtext/) supports the development of programming languages and domain-specific languages.
- [Henshin](https://www.eclipse.org/henshin/) is used to define the transformation units that manipulate models.
- [MOMoT](http://martin-fleck.github.io/momot/) combines model-driven engineering with search-based optimisation for complex model-level problems.

## Licence

Gotten is open-source software distributed under the [Eclipse Public License 2.0](LICENSE).

## Acknowledgements

This work was funded by the Spanish Ministry of Science through project MASSIVE (RTI2018-095255-B-I00) and by the Madrid R&D programme through project [FORTE](https://antares.sip.ucm.es/forte-cm/) (P2018/TCS-4314).

## Contact

Send comments or questions to pablo.gomeza@uam.es.
