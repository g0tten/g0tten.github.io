---
layout: page
title: "Contact"
css: ["contact.css"]
---

<div class="col s12">
  <div class="contact-grid">
    <article class="contact-card contact-card--wide">
      <span class="eyebrow">Get in touch</span>
      <h2>Let's talk about Gotten, research use cases, or installation support.</h2>
      <p>
        The project links below provide the fastest way to explore the repository, access the update site,
        or contact the maintainer directly.
      </p>
    </article>

    <article class="contact-card">
      <h3>Email</h3>
      <p>For questions, feedback, or collaboration, write to the project contact.</p>
      <a href="mailto:{{site.user_email}}">{{site.user_email}}</a>
    </article>

    <article class="contact-card">
      <h3>GitHub</h3>
      <p>Browse repositories, releases, and public project assets maintained by the Gotten organisation.</p>
      <a href="{{site.github_profile}}" target="_blank">{{site.github_profile}}</a>
    </article>

    <article class="contact-card">
      <h3>Project page</h3>
      <p>Visit the maintainer page for additional background and related work.</p>
      <a href="{{site.contact_url}}" target="_blank">{{site.contact_url}}</a>
    </article>

    <article class="contact-card">
      <h3>Installation</h3>
      <p>Install Gotten through the Eclipse update site or download the standalone package.</p>
      <a href="{{site.update_site_url}}" target="_blank">Open the update site</a>
      <a href="{{site.standalone_url}}" target="_blank">Download the standalone package</a>
    </article>
  </div>
</div>
