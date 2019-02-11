import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Fade,
} from '@material-ui/core'

import { STATUS, proveOwnership, transferOwnership, wrap } from 'store/deftyAction'

import styles from './styles.module.css'

class StepsWrap extends React.Component {
  state = {
    activeStep: 0,
    subtitle: `
      To trade a CDP with 0x you need to wrap the CDP into an NFT.
      For the moment this is done in 3 successive different steps.
      These steps must be done in order and without interruption.
    `,
    steps: [
      {
        loading: false,
        complete: false,
        label: 'Proof of Ownership',
        content: `To wrap your CDP, you will need to sign a meesage from your
          address, proving you are the owner of the CDP.
        `,
        actionTitle: 'Prove Ownership',
      },
      {
        loading: false,
        complete: false,
        label: 'Transfer Ownership',
        content: `Then you have to forward the CDP ownership of the wrapping
        contract, in order for it to mint the corresponding NFT.`,
        actionTitle: 'Transfer Ownership',
      },
      {
        loading: false,
        complete: false,
        label: 'Mint your NFT',
        content: `Once the ownership is transfered you can mint your NFT and
        start trading it with 0x!`,
        actionTitle: 'Mint NFT'
      },
    ]
  };

  async stepAction(activeStep, cup) {
    let action;
    switch(activeStep) {
      case 0:
        action = this.props.proveOwnership
        break;
      case 1:
        action = this.props.transferOwnership
        break;
      case 2:
        action = this.props.wrap
        break;
      default:
        return console.warn('No step')
    }
    let success = false
    try {
      this.isLoading(true)
      await action(cup)
      success = true
    } catch (err) {
      this.isLoading(false)
      console.warn('Attempted', action, err)
    } finally {
      this.isLoading(false)
      if (success) this.nextStep()
    }
  }

  isLoading(value) {
    const { steps, activeStep } = this.state
    steps[activeStep].loading = value
    this.setState(steps)
  }

  nextStep() {
    const { steps, activeStep } = this.state
    steps[activeStep].complete = true
    this.setState({
      steps,
      activeStep: activeStep + 1
    })
  }


  render() {
    const { activeStep, steps } = this.state;
    const { cup, onComplete } = this.props
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Typography variant="h6" id="modal-title" gutterBottom>
            Wrapping CDP #{cup ? cup.cupData.id : ''}
          </Typography>
          <Typography id="simple-modal-description">
            {this.state.subtitle}
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index} active={true} completed={step.complete}>
                <StepLabel active={activeStep === index}>
                  <Typography variant="subtitle2">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography>{step.content}</Typography>
                  <div className={styles.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep !== index}
                        variant="contained"
                        color="primary"
                        onClick={() => this.stepAction(index, cup)}
                        className={styles.button}>
                        <Fade
                           in={step.loading}
                           style={{ transitionDelay: step.loading ? '300ms' : '0ms' }}
                           unmountOnExit>
                           <CircularProgress size={16} color="secondary" className={styles.progress} />
                         </Fade>
                        {step.actionTitle}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {
            activeStep === steps.length
            && (
              <Paper square elevation={0} className={styles.footer}>
                <Typography>All steps completed - you&apos;re finished!</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onComplete}>
                  Close
                </Button>
              </Paper>
            )
          }
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  proveOwnership: cup => dispatch(proveOwnership(cup)),
  transferOwnership: cup => dispatch(transferOwnership(cup)),
  wrap: cup => dispatch(wrap(cup)),
})

export default connect(
  null,
  mapDispatchToProps
)(StepsWrap)
