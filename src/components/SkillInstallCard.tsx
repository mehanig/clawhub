import type { ClawdisSkillMetadata } from 'clawhub-schema'
import { formatInstallCommand, formatInstallLabel } from './skillDetailUtils'

const CAPABILITY_DISPLAY: Record<string, { icon: string; label: string }> = {
  shell: { icon: '>_', label: 'Shell commands' },
  filesystem: { icon: '\uD83D\uDCC2', label: 'File access' },
  network: { icon: '\uD83C\uDF10', label: 'Web search/fetch' },
  browser: { icon: '\uD83D\uDD0D', label: 'Browser control' },
  sessions: { icon: '\u26A1', label: 'Session orchestration' },
  messaging: { icon: '\u2709\uFE0F', label: 'Message sending' },
  scheduling: { icon: '\u23F0', label: 'Scheduling/cron' },
}

type SkillInstallCardProps = {
  clawdis: ClawdisSkillMetadata | undefined
  osLabels: string[]
}

export function SkillInstallCard({ clawdis, osLabels }: SkillInstallCardProps) {
  const requirements = clawdis?.requires
  const installSpecs = clawdis?.install ?? []
  const envVars = clawdis?.envVars ?? []
  const dependencies = clawdis?.dependencies ?? []
  const links = clawdis?.links
  const hasCapabilities = Boolean(clawdis?.capabilities?.length)
  const hasRuntimeRequirements = Boolean(
    clawdis?.emoji ||
      osLabels.length ||
      requirements?.bins?.length ||
      requirements?.anyBins?.length ||
      requirements?.env?.length ||
      requirements?.config?.length ||
      envVars.length ||
      clawdis?.primaryEnv,
  )
  const hasInstallSpecs = installSpecs.length > 0
  const hasDependencies = dependencies.length > 0
  const hasLinks = Boolean(links?.homepage || links?.repository || links?.documentation)

  if (!hasCapabilities && !hasRuntimeRequirements && !hasInstallSpecs && !hasDependencies && !hasLinks) {
    return null
  }

  return (
    <div className="skill-hero-content">
      <div className="skill-hero-panels">
        {hasCapabilities ? (
          <div className="skill-panel">
            <h3 className="section-title" style={{ fontSize: '1rem', margin: 0 }}>
              Capabilities
            </h3>
            <div className="skill-panel-body">
              {clawdis!.capabilities!.map((cap) => (
                <div key={cap} className="stat">
                  <span>{CAPABILITY_DISPLAY[cap]?.icon ?? cap}</span>
                  <span>{CAPABILITY_DISPLAY[cap]?.label ?? cap}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {hasRuntimeRequirements ? (
          <div className="skill-panel">
            <h3 className="section-title" style={{ fontSize: '1rem', margin: 0 }}>
              Runtime requirements
            </h3>
            <div className="skill-panel-body">
              {clawdis?.emoji ? <div className="tag">{clawdis.emoji} Clawdis</div> : null}
              {osLabels.length ? (
                <div className="stat">
                  <strong>OS</strong>
                  <span>{osLabels.join(' · ')}</span>
                </div>
              ) : null}
              {requirements?.bins?.length ? (
                <div className="stat">
                  <strong>Bins</strong>
                  <span>{requirements.bins.join(', ')}</span>
                </div>
              ) : null}
              {requirements?.anyBins?.length ? (
                <div className="stat">
                  <strong>Any bin</strong>
                  <span>{requirements.anyBins.join(', ')}</span>
                </div>
              ) : null}
              {requirements?.env?.length ? (
                <div className="stat">
                  <strong>Env</strong>
                  <span>{requirements.env.join(', ')}</span>
                </div>
              ) : null}
              {requirements?.config?.length ? (
                <div className="stat">
                  <strong>Config</strong>
                  <span>{requirements.config.join(', ')}</span>
                </div>
              ) : null}
              {clawdis?.primaryEnv ? (
                <div className="stat">
                  <strong>Primary env</strong>
                  <span>{clawdis.primaryEnv}</span>
                </div>
              ) : null}
              {envVars.length > 0 ? (
                <div className="stat">
                  <strong>Environment variables</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                    {envVars.map((env, index) => (
                      <div
                        key={`${env.name}-${index}`}
                        style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}
                      >
                        <code style={{ fontSize: '0.85rem' }}>{env.name}</code>
                        {env.required === false ? (
                          <span style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>optional</span>
                        ) : env.required === true ? (
                          <span style={{ color: 'var(--ink-accent)', fontSize: '0.75rem' }}>required</span>
                        ) : null}
                        {env.description ? (
                          <span style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
                            — {env.description}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {hasDependencies ? (
          <div className="skill-panel">
            <h3 className="section-title" style={{ fontSize: '1rem', margin: 0 }}>
              Dependencies
            </h3>
            <div className="skill-panel-body">
              {dependencies.map((dep, index) => (
                <div key={`${dep.name}-${index}`} className="stat">
                  <div>
                    <strong>{dep.name}</strong>
                    <span style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                      {dep.type}
                      {dep.version ? ` ${dep.version}` : ''}
                    </span>
                    {dep.url ? (
                      <div style={{ fontSize: '0.8rem' }}>
                        <a href={dep.url} target="_blank" rel="noopener noreferrer">
                          {dep.url}
                        </a>
                      </div>
                    ) : null}
                    {dep.repository && dep.repository !== dep.url ? (
                      <div style={{ fontSize: '0.8rem' }}>
                        <a href={dep.repository} target="_blank" rel="noopener noreferrer">
                          Source
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {hasInstallSpecs ? (
          <div className="skill-panel">
            <h3 className="section-title" style={{ fontSize: '1rem', margin: 0 }}>
              Install
            </h3>
            <div className="skill-panel-body">
              {installSpecs.map((spec, index) => {
                const command = formatInstallCommand(spec)
                return (
                  <div key={`${spec.id ?? spec.kind}-${index}`} className="stat">
                    <div>
                      <strong>{spec.label ?? formatInstallLabel(spec)}</strong>
                      {spec.bins?.length ? (
                        <div style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>
                          Bins: {spec.bins.join(', ')}
                        </div>
                      ) : null}
                      {command ? <code>{command}</code> : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
        {hasLinks ? (
          <div className="skill-panel">
            <h3 className="section-title" style={{ fontSize: '1rem', margin: 0 }}>
              Links
            </h3>
            <div className="skill-panel-body">
              {links?.homepage ? (
                <div className="stat">
                  <strong>Homepage</strong>
                  <a href={links.homepage} target="_blank" rel="noopener noreferrer">
                    {links.homepage}
                  </a>
                </div>
              ) : null}
              {links?.repository ? (
                <div className="stat">
                  <strong>Repository</strong>
                  <a href={links.repository} target="_blank" rel="noopener noreferrer">
                    {links.repository}
                  </a>
                </div>
              ) : null}
              {links?.documentation ? (
                <div className="stat">
                  <strong>Docs</strong>
                  <a href={links.documentation} target="_blank" rel="noopener noreferrer">
                    {links.documentation}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
