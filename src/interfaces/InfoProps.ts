interface HeaderProps {
    id: string;
    img?: string;
    title: string;
    subtitle?: string;
}

export interface ToggleProps extends HeaderProps{
    propOne: string;
    propTwo?: string;
    propThree?: string;
    propFour?: string;
    propFive?: string;
    propSix?: string;
}

export interface BookProps extends ToggleProps {
    added: boolean,
    notes: string
}

export interface AccordionElProps extends HeaderProps {
    propOne: ToggleProps[]
}

interface SingleSkillProps {
    name: string,
    requirements: string,
    description: string,
    criticalSuccess: string,
    success: string,
    failure: string,
    criticalFailure: string,
    samples: string,
    table?: string[][]
}

export interface SkillsProps extends HeaderProps {
    propOne: SingleSkillProps[]

}