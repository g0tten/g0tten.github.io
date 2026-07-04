# Gotten

**G**eneric MDE framework f**O**r me**T**amorphic **TE**sti**N**g

Gotten is a model-driven engineering solution to automate the construction of domain-specific **Metamorphic Testing (MT)** environments. Starting from a meta-model capturing the domain concepts, and a description of the domain execution environment, Gotten produces an MT environment with comprehensive support for the MT process: the definition of domain-specific Metamorphic Relations (MRs), their evaluation, detailed reporting of the testing results, and the automated search-based generation of follow-up test cases.

Gotten has been applied to domains such as cloud simulators, video streaming APIs, autonomous vehicles, and finite automata.

🌐 **Project website:** https://g0tten.github.io/

> **About this repository:** it contains the source of the Gotten project website, and hosts the Eclipse update site of the Gotten environment (under [`gotten/update-site`](gotten/update-site)).

## Installation

Gotten is provided as a set of Eclipse plug-ins. It requires **Java 11** installed on your machine.

### Option 1: Install from the update site (recommended)

1. In Eclipse, open **Help → Install New Software…**
2. Click **Add…** and enter the Gotten update site:

   ```
   https://g0tten.github.io/gotten/update-site/
   ```

3. Select **Gotten** from the list, click **Next**, and follow the wizard to complete the installation.
4. Restart Eclipse when prompted.

### Option 2: Pre-packaged distributions

- [Standalone Eclipse+Gotten for Windows](https://www.dropbox.com/scl/fi/r79boq7wxzbwey0n3umwq/eclipse.zip?rlkey=qyb55mg285dsj7w4kwmki0gkd&dl=0)
- [Standalone Eclipse+Gotten for Ubuntu](https://www.dropbox.com/scl/fi/qnwgkz7r0dk0aa97qe5m0/eclipse.zip?rlkey=oqfhb39zwi8ncqp1ogs20aogz&dl=0)
- [Ubuntu 20.04 VirtualBox VM with Gotten pre-installed](https://www.dropbox.com/s/m4s7rjk1tywl8cf/Ubuntu-20.04.x64-Gotten.zip?dl=0)

## A quick example

Gotten provides a DSL called **mrDSL** to define and execute Metamorphic Relations. The following program targets the cloud simulators domain: it declares the domain meta-models, input features defined by OCL expressions, output features, processor attributes, and two MRs:

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

A second DSL, **fowDSL**, drives the search-based generation of follow-up test cases (based on [MOMoT](http://martin-fleck.github.io/momot/)):

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

## Demos

- [Video demo of the Gotten environment in action](https://youtu.be/PVVtZCxcnNc)
- [Short introduction video presentation of Gotten](https://youtu.be/DeuIW6V4LaQ)

## Sample projects

- [Gotten for cloud — simple project](https://github.com/g0tten/sample)
- [Gotten for cloud — evaluation project](https://github.com/g0tten/evaluation)
- [Gotten for video streaming APIs (YouTube and Vimeo)](https://github.com/g0tten/video)

## Publications

1. Cañizares, P. C., Gómez-Abajo, P., Guerra, E., de Lara, J., 2026. [Towards metamorphic testing with LLM-based workflows: Metamorphic relation inference and follow-up test case generation](https://www.sciencedirect.com/science/article/pii/S0950584926001394). In *Information and Software Technology* (Elsevier).
2. Gómez-Abajo, P., Cañizares, P. C., Núñez, A., Guerra, E., de Lara, J., 2023. [Gotten: A model-driven solution to engineer domain-specific metamorphic testing environments](https://ieeexplore.ieee.org/document/10350786). In *ACM/IEEE 26th International Conference on Model Driven Engineering Languages and Systems (MoDELS 2023)*, Västerås.
3. Gómez-Abajo, P., Cañizares, P. C., Núñez, A., Guerra, E., de Lara, J., 2023. [Automated engineering of domain-specific metamorphic testing environments](https://www.sciencedirect.com/science/article/pii/S0950584923000186). In *Information and Software Technology* (Elsevier).
4. Cañizares, P. C., Gómez-Abajo, P., Núñez, A., Guerra, E., de Lara, J., 2021. [New ideas: Automated engineering of metamorphic testing environments for domain-specific languages](https://dl.acm.org/doi/10.1145/3486608.3486904). In *ACM SIGPLAN International Conference on Software Language Engineering (SLE 2021)*, Chicago. 🏆 **Best new ideas/vision paper award at SLE'21.**

## Authors and contributors

Gotten has been developed by [Pablo Gómez-Abajo](https://github.com/gomezabajo), [Pablo C. Cañizares](https://github.com/PabloCCanizares), [Alberto Núñez](https://github.com/albenune), [Esther Guerra](https://github.com/estherguerra) and [Juan de Lara](https://github.com/jdelara).

We thank the developers of the frameworks used to build Gotten:

- [Xtext](https://www.eclipse.org/Xtext/) — for the development of the Gotten DSLs.
- [Henshin](https://www.eclipse.org/henshin/) — used to formulate the transformation units that manipulate the models.
- [MOMoT](http://martin-fleck.github.io/momot/) — a framework combining MDE techniques with search-based optimization, used for the follow-up test case generation.

## License

Gotten is open-source software distributed under the [Eclipse Public License 2.0](LICENSE).

## Acknowledgements

This work has been funded by the Spanish Ministry of Science (RTI2018-095255-B-I00, project "MASSIVE") and the R&D programme of Madrid (P2018/TCS-4314, project "[FORTE](https://antares.sip.ucm.es/forte-cm/)").

## Contact

Send your comments or questions to pablo.gomeza@uam.es.
