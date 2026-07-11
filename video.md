---
layout: page
title: "Gotten for Video Streaming"
---

This example applies Gotten, a generic model-driven engineering framework for metamorphic testing, to video streaming APIs.

### Running example for video streaming APIs

This example demonstrates the generality and flexibility of Gotten by defining a metamorphic testing environment for video streaming APIs. The approach groups related APIs into domains, such as video streaming, audio streaming, hotel booking, and flight booking, as illustrated below.

![APIs diagram](https://raw.githubusercontent.com/g0tten/images/main/figures/apis.png)

Each domain can be described through a meta-model and a set of metamorphic relations. Different processors can then implement the corresponding API; for the video streaming domain, the processors considered here are YouTube and Vimeo.

The following figure presents the meta-model for video streaming APIs. The `VideoAPITest` class represents a named test case through its `testName` attribute. For simplicity, each test case contains one operation: search, upload, or update. Upload and update operations require a video parameter identified by an ID and may also include a title, a description, and a list of tags. A video can provide statistical data through `VideoStatistics`, including the number of views and likes. The results produced by each operation are stored through the `results` reference.

![Video streaming API meta-model](https://raw.githubusercontent.com/g0tten/images/main/model/video_streaming_mm.png)

### mrDSL program for video streaming APIs

Because it is difficult to define a conventional test oracle that determines whether a video streaming API behaves correctly, this example uses metamorphic testing. The following listing shows the mrDSL program used to apply Gotten to the video streaming API domain.

```
metamodel videostream "/video/model/VideoStream.ecore" with m1, m2
models "/video/model/videotc"

videostream input Features {
	context VideoAPITest def: IsFullSearch: Boolean =
          request.oclIsTypeOf(SearchVideo)
          and request.oclAsType(SearchVideo).maxResults = -1
  context VideoAPITest def: IsUpdate: Boolean = request.oclIsTypeOf(UpdateVideo)
  context SearchVideo def: MaxResults: Int = maxResults
  context SearchVideo def: SearchOrder: Int = orderType
  context SearchVideo def: UntilYear: Int = until.year
  context SearchVideo def: FromYear: Int = from.year
  context SearchVideo def: Radius: Double = position.radius
}

output Features {
  NVideos : Long
  Results: Set
  OutputVideoId: Long
  OutputVideoTitle: String
}

Processor {
  Name: String
  Version: String
}

MetamorphicRelations {
 MR1 = [ (IsFullSearch(m1) and SearchOrder(m1) <> SearchOrder(m2))
         implies (NVideos(m1) == NVideos(m2)) ]
 MR2 = [ (IsFullSearch(m1) and UntilYear(m1) < FromYear(m2))
         implies (Results(m1)->excludes(Results(m2))) ]
 MR3 = [ (IsFullSearch(m1) and Radius(m1) > Radius(m2))
         implies (Results(m1)->includes(Results(m2))) ]
 MR4 = [ (IsFullSearch(m1) and MaxResults(m1) >= MaxResults(m2))
         implies (NVideos(m1) >= NVideos(m2))]
 MR5 = [ (IsUpdate(m1) and m1 == m2)
         implies
         (OutputVideoId(m1) <> OutputVideoId(m2) and
         OutputVideoTitle(m1) == OutputVideoTitle(m2))]
}
```

### Brief description of the metamorphic relations

The following table summarises the five metamorphic relations defined for the video streaming API example.

Relation | Description |
--- | :--- |
MR1 | The full searches `m1` and `m2` use different result orders. |
&nbsp; | MR1i = [ (IsFullSearch(m1) and SearchOrder(m1) <> SearchOrder(m2)) ] |
&nbsp; | Both searches should return the same number of videos. |
&nbsp; | MR1o = [ (NVideos(m1) == NVideos(m2))] |
MR2 | The final year of search `m1` is earlier than the initial year of search `m2`. |
&nbsp; | MR2i = [ (IsFullSearch(m1) and UntilYear(m1) < FromYear(m2)) ] |
&nbsp; | The result set of `m1` should exclude the result set of `m2`. |
&nbsp; | MR2o = [ (Results(m1)->excludes(Results(m2)))] |
MR3 | Search `m1` uses a larger geographical radius than search `m2`. |
&nbsp; | MR3i = [ (IsFullSearch(m1) and Radius(m1) > Radius(m2)) ] |
&nbsp; | The result set of `m1` should include the result set of `m2`. |
&nbsp; | MR3o = [ (Results(m1)->includes(Results(m2)))] |
MR4 | The maximum number of videos requested by search `m1` is greater than or equal to the number requested by search `m2`. |
&nbsp; | MR4i = [ (IsSearch(m1) and MaxResults(m1) >= MaxResults(m2)) ] |
&nbsp; | Search `m1` should return at least as many videos as search `m2`. |
&nbsp; | MR4o = [ (NVideos(m1) >= NVideos(m2))] |
MR5 | Update operations `m1` and `m2` are identical. |
&nbsp; | MR5i = [ (IsUpdate(m1) and m1 == m2) ] |
&nbsp; | The returned video IDs should be different, while the returned video titles should be equal. |
&nbsp; | MR5o = [ (OutputVideoId(m1) <> OutputVideoId(m2)) <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; and (OutputVideoTitle(m1) == OutputVideoTitle(m2))) ] |

### Experiment with YouTube and Vimeo

We conducted an experiment using MR1, MR4, and MR5. For MR1 and MR4, the source test cases included queries based on trending searches on YouTube and Vimeo, such as `world cup` and `esports`. These queries were complemented by boundary cases reported by Segura et al.[^1], including `winter pentathlon 1949` and `mistrustfully`. The same tests were reused for both platforms.

Executing all tests took 4 minutes and 4 seconds on YouTube and 10 minutes and 36 seconds on Vimeo. The results show that the framework can formalise the metamorphic relations described in natural language by Segura et al.[^1], reproduce their results, and detect real issues reported in the [issue-tracking systems](https://code.google.com/p/gdata-issues/issues/detail?id=5173) of the platforms studied.

[^1]: S. Segura, J. A. Parejo, J. Troya, and A. Ruiz Cortés. “Metamorphic testing of RESTful web APIs”. *IEEE Transactions on Software Engineering*, 44(11):1083–1099, 2018.

### Download the YouTube and Vimeo project

The project archive includes the Gotten project for YouTube and Vimeo together with the data generated and used in the experiment described above.

- [Gotten for YouTube and Vimeo](https://github.com/g0tten/video/zipball/main)

### Video demonstration

Select the image below to watch a demonstration of the Gotten environment for video streaming APIs.

[![Gotten for video streaming APIs environment in action](https://raw.githubusercontent.com/g0tten/images/main/ide/gotten_video_screenshot.png)](https://youtu.be/10MDPC9jQQI)

### Acknowledgements

This work was funded by the Spanish Ministry of Science through project MASSIVE (RTI2018-095255-B-I00) and by the Madrid R&D programme through project [FORTE](https://antares.sip.ucm.es/forte-cm/) (P2018/TCS-4314).
